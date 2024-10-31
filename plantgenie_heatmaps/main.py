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

    # Map gene_ids to their original order for sorting results later
    gene_id_order = {
        (gene.chromosome_id, gene.gene_id): i for i, gene in enumerate(gene_ids)
    }

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

        # Collect and reorder results based on original input order
        annotations = [
            GeneAnnotation(
                **{k: v for k, v in zip(GeneAnnotation.model_fields.keys(), result)}
            )
            for result in query_relation.fetchall()
        ]

        # Sort by the original order of gene_ids
        ordered_annotations = sorted(
            annotations,
            key=lambda annotation: gene_id_order[
                (annotation.chromosome_id, annotation.gene_id)
            ],
        )

        return AnnotationsResponse(results=ordered_annotations)


@app.post("/api/expression")
async def get_expression_duckdb(request: ExpressionRequest) -> ExpressionResponse:
    gene_ids = GeneInfo.split_gene_ids_from_request(request.gene_ids)

    gene_id_order = {
        (gene.chromosome_id, gene.gene_id): i for i, gene in enumerate(gene_ids)
    }

    with duckdb.connect(DATABASE_PATH, read_only=True) as connection:
        experiment = connection.sql(
            "SELECT relation_name FROM experiments WHERE id = ?",
            params=[request.experiment_id],
        ).fetchone()[0]

        samples_ordered = [
            SampleInfo(
                experiment=experiment,
                sample_id=sample[0],
                reference=sample[1],
                sequencing_id=sample[2],
                condition=sample[3],
            )
            for sample in connection.sql(
                "SELECT id, reference, sample_filename, condition from samples WHERE experiment_id = ?",
                params=[request.experiment_id],
            )
            .order("id")
            .fetchall()
        ]

        sample_info_order = {sample.sample_id: i for i, sample in enumerate(samples_ordered)}

        query = (
            f"SELECT sample_id, chromosome_id, gene_id, tpm from {experiment} "
            f"WHERE (chromosome_id, gene_id) IN ({", ".join(["(?, ?)"] * len(gene_ids))})"
        )

        query_relation = connection.sql(
            query=query,
            params=[
                value
                for gene in gene_ids
                for value in (gene.chromosome_id, gene.gene_id)
            ],
        )

        gene_infos = [
            GeneInfo(chromosome_id=gene[0], gene_id=gene[1])
            for gene in query_relation.project("chromosome_id", "gene_id")
            .distinct()
            .order("chromosome_id, gene_id")
            .fetchall()
        ]

        results = query_relation.project(
            "chromosome_id", "gene_id", "sample_id", "tpm"
        ).fetchall()

        results_ordered = sorted(
            results,
            # sort first by chromosome_id, gene_id, then by sample_id
            key=lambda result: (
                gene_id_order[(result[0], result[1])],
                sample_info_order[result[2]],
            ),
        )

        gene_infos_ordered = sorted(
            gene_infos,
            key=lambda gene_info: gene_id_order[
                (gene_info.chromosome_id, gene_info.gene_id)
            ],
        )

        return ExpressionResponse(
            samples=samples_ordered,
            genes=gene_infos_ordered,
            values=[x[3] for x in results_ordered],
        )
