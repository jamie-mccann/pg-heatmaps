from typing import Optional

import duckdb
import pyarrow
import pyarrow.dataset

from fastapi import APIRouter, HTTPException

from plantgenie_heatmaps import DATA_PATH
from plantgenie_heatmaps.models import (
    AvailableChromosomesRequest,
    AvailableChromosomesResponse,
    AvailableGenome,
    AvailableGenomesResponse,
    GenomeSequenceRequest,
    GenomeSequenceResponse,
)

router = APIRouter()


PARQUET_GENOMES_PATH = DATA_PATH / "genomes"
PARQUET_SEQUENCE_CHUNK_LENGTH = 1000
MAX_SEQUENCE_RETURN_LENGTH = 1_000_000  # 1 Megabase

FASTA_GENOME_SCHEMA = pyarrow.schema(
    [
        ("chromosome_id", pyarrow.string()),
        ("chunk_id", pyarrow.int32()),
        ("sequence", pyarrow.string()),
        ("length", pyarrow.int32()),
    ],
)

FASTA_GENOME_PARTITIONING = pyarrow.dataset.partitioning(
    schema=pyarrow.schema(
        [
            ("chromosome_id", pyarrow.string()),
        ]
    ),
    flavor="hive",
)


@router.get("/genome/list-available-genomes")
async def get_available_genomes() -> AvailableGenomesResponse:
    species_version_prep = [
        p.stem[::-1].split("-", 1)[::-1] for p in PARQUET_GENOMES_PATH.glob("*")
    ]

    return AvailableGenomesResponse(
        genomes=[
            AvailableGenome(species=genome[0][::-1], version=genome[-1][::-1])
            for genome in species_version_prep
        ]
    )


@router.post("/genome/list-available-chromosomes")
async def get_available_chromosomes(
    request: AvailableChromosomesRequest,
) -> AvailableChromosomesResponse:
    # ruff: noqa: F841 reason: queried by duckdb <--> parquet
    dataset = pyarrow.dataset.dataset(
        PARQUET_GENOMES_PATH / f"{request.species}-{request.version}",
        partitioning=FASTA_GENOME_PARTITIONING,
        schema=FASTA_GENOME_SCHEMA,
    )

    query = "select distinct(chromosome_id) from dataset order by chromosome_id;"

    with duckdb.connect() as connection:
        chromosomes = connection.sql(query=query).fetchall()

    return AvailableChromosomesResponse(
        chromosomes=[chromosome[0] for chromosome in chromosomes]
    )


@router.post("/genome/sequence")
async def get_genomic_sequence(
    request: GenomeSequenceRequest,
) -> GenomeSequenceResponse:
    if abs(request.end - request.begin) > MAX_SEQUENCE_RETURN_LENGTH:
        raise HTTPException(
            status_code=403, detail=f"{request.begin} - {request.end} range is > 1 Mb"
        )

    # ruff: noqa: F841 reason: queried by duckdb <--> parquet
    dataset = pyarrow.dataset.dataset(
        PARQUET_GENOMES_PATH / f"{request.species}-{request.ve}",
        partitioning=FASTA_GENOME_PARTITIONING,
        schema=FASTA_GENOME_SCHEMA,
    )

    query = """
        SELECT string_agg(sequence, '')[
            ($start_index % $max_chunk_length):
            (($start_index % $max_chunk_length) + $end_index - $start_index)
        ]
        FROM (
            SELECT chunk_id, sequence
            FROM dataset
            WHERE chromosome_id = $chromosome
              AND chunk_id >= $start_index // $max_chunk_length
              AND chunk_id <= $end_index // $max_chunk_length
            ORDER BY chunk_id
        );
    """

    with duckdb.connect() as connection:
        params = {
            "chromosome": request.chromosome,
            "start_index": request.begin,
            "end_index": request.end,
            "max_chunk_length": PARQUET_SEQUENCE_CHUNK_LENGTH,
        }
        result_sequence = connection.sql(query=query, params=params).fetchone()[0]

    if result_sequence is None:
        raise HTTPException(
            status_code=400,
            detail=f"{request.chromosome}:{request.begin}-{request.end} not found in sequence database",
        )

    return GenomeSequenceResponse(
        name=f"{request.chromosome}:{request.begin}-{request.end}",
        sequence=result_sequence,
    )
