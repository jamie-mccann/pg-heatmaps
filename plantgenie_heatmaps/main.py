import os
from pathlib import Path

import duckdb

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from plantgenie_heatmaps.models import (
    AnnotationsRequest,
    AnnotationsResponse,
    ExpressionRequest,
    ExpressionResponse,
    GeneAnnotation,
    GeneInfo,
    SampleInfo,
)

DATA_PATH = (
    Path(os.environ.get("DATA_PATH")) or Path(__file__).parent.parent / "example_data"
)

DATABASE_PATH = DATA_PATH / "upsc-plantgenie.db"

app_path = Path(__file__).parent.parent
static_files_path = app_path / "react-frontend" / "dist"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  # Allow all origins (change this to specific origins in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

app.mount("/static", StaticFiles(directory=static_files_path), name="static")


@app.get("/", include_in_schema=False)
async def root():
    return FileResponse(static_files_path / "index.html")


@app.get("/api")
async def api_root():
    message = {
        "message": "Hello from API!",
        "data_files": [p.__str__() for p in DATA_PATH.glob("*")],
    }

    return message


@app.post("/api/annotations")
async def get_annotations_duckdb(request: AnnotationsRequest) -> AnnotationsResponse:
    gene_ids = GeneInfo.split_gene_ids_from_request(request.gene_ids)

    # build query template with (?, ?) for each gene_id
    query = (
        "SELECT * FROM annotations WHERE (chromosome_id, gene_id) IN ("
        + ", ".join(["(?, ?)"] * len(request.gene_ids))
        + ")"
    )

    with duckdb.connect(DATABASE_PATH, read_only=True) as connection:
        query_relation = connection.sql(
            query=query,
            params=[
                value
                for gene in gene_ids
                for value in (gene.chromosome_id, gene.gene_id)
            ],
        ).project(  # we don't need id or genome_id here
            "chromosome_id",
            "gene_id",
            "tool",
            "evalue",
            "score",
            "seed_ortholog",
            "description",
        )

        return AnnotationsResponse(
            results=[
                GeneAnnotation(
                    # zip the GeneAnnotation fields with the row tuple - match order in query!
                    **{k: v for k, v in zip(GeneAnnotation.model_fields.keys(), result)}
                )
                for result in query_relation.fetchall()
            ]
        )


@app.post("/api/expression")
async def get_expression_duckdb(request: ExpressionRequest) -> ExpressionResponse:
    gene_ids = GeneInfo.split_gene_ids_from_request(request.gene_ids)

    with duckdb.connect(DATABASE_PATH, read_only=True) as connection:
        experiment = (
            connection.sql(
                "SELECT * FROM experiments WHERE id = ?", params=[request.experiment_id]
            )
            .project("relation_name")
            .fetchone()[0]
        )

        query = (
            "SELECT * FROM ("
            f"SELECT * FROM {experiment} WHERE (chromosome_id, gene_id) IN ("
            + ", ".join(["(?, ?)"] * len(gene_ids))
            + ")) AS l "
            "JOIN samples AS r ON (l.sample_id = r.id)"
        )

        query_relation = connection.sql(
            query=query,
            params=[
                value
                for gene in gene_ids
                for value in (gene.chromosome_id, gene.gene_id)
            ],
        )

        samples = [
            SampleInfo(
                experiment=experiment,
                sample_id=sample[0],
                sequencing_id=sample[1],
                condition=sample[2],
            )
            for sample in query_relation.project(
                "reference", "sample_filename", "condition", "sample_id"
            )
            .distinct()
            .order("sample_id")
            .fetchall()
        ]

        gene_infos = [
            GeneInfo(chromosome_id=gene[0], gene_id=gene[1])
            for gene in query_relation.project("chromosome_id", "gene_id")
            .distinct()
            .order("chromosome_id, gene_id")
            .fetchall()
        ]

        return ExpressionResponse(
            samples=samples,
            genes=gene_infos,
            values=[
                x[0]
                for x in query_relation.order("chromosome_id, gene_id, sample_id")
                .project("tpm")
                .fetchall()
            ],
        )
