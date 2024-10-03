import os
from pathlib import Path

import polars
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from plantgenie_heatmaps.models import (
    ExpressionResponse,
    GeneList,
    GenesResponse,
    GeneAnnotation,
)

DATA_PATH = Path(os.environ.get("DATA_PATH")) or Path(__file__).parent.parent / "example_data"

lazy_dataframes = {
    x.stem: polars.scan_csv(x, separator="\t") for x in DATA_PATH.glob("*.tsv")
}

app_path = Path(__file__).parent
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


@app.post("/api/expression_data")
async def get_gene_expression_data(request: GeneList) -> ExpressionResponse:
    expression_data_lazy = lazy_dataframes["conifer_networks_tpm_data_reformatted"]
    annotations_lazy = lazy_dataframes["picab_v2p0_gene_annotation_unique_table"]
    species_lazy = lazy_dataframes["species_table"]
    request_pairs = polars.DataFrame(
        # submitted gene ids must have a chromosome and gene identifier separated by "_"
        data=map(
            lambda s: ("_".join(s.split("_")[:-1]), s.split("_")[-1]),
            request.gene_ids,
        ),
        schema={"chromosome_id": polars.Utf8, "gene_id": polars.Utf8},
    )

    results = (
        request_pairs.lazy()  # required bc other DFs are lazy
        .join(expression_data_lazy, on=["chromosome_id", "gene_id"], how="inner")
        .join(species_lazy, how="inner", on="species_id")
        .join(
            annotations_lazy, on=["chromosome_id", "gene_id", "species_id"], how="inner"
        )
        .select(
            [
                "chromosome_id",
                "gene_id",
                "genus",
                "species",
                "experiment_id",
                "replicate_id",
                "stub",
                "description",
                "result",
                "result_type",
                "tool",
                "description_right",
                "evalue",
                "score",
            ]
        )
        .rename(
            {
                "description": "experiment_description",
                "description_right": "annotation",
            }
        )
        .sort(
            "chromosome_id",
            "gene_id",
            "experiment_id",
            "replicate_id",
        )
        .collect()
    )

    gene_information = (
        results
        .group_by(
            polars.col("chromosome_id"),
            polars.col("gene_id"),
            maintain_order=True
        )
        .agg([])
        .to_dicts()
    )

    sample_information = (
        results
        .group_by(
            polars.col("experiment_id"),
            polars.col("replicate_id"),
            polars.col("stub"),
            polars.col("experiment_description"),
            maintain_order=True
        )
        .agg([])
        .to_dicts()
    )

    return ExpressionResponse(
        genes=gene_information,
        samples=sample_information,
        values=results.select(polars.col("result")).to_series().to_list()
    )


@app.post("/api/genes")
async def annotations_from_gene_list(request: GeneList) -> GenesResponse:
    annotations = lazy_dataframes["picab_v2p0_gene_annotation_unique_table"]
    species = lazy_dataframes["species_table"]

    columns = [
        "chromosome_id",
        "gene_id",
        "genus",
        "species",
        "tool",
        "annotation",
        "evalue",
        "score",
    ]

    request_pairs = polars.DataFrame(
        data=map(
            lambda s: ("_".join(s.split("_")[:-1]), s.split("_")[-1]),
            request.gene_ids,
        ),
        schema={"chromosome_id": polars.Utf8, "gene_id": polars.Utf8},
    )

    results = (
        request_pairs.lazy()
        .join(annotations, on=["chromosome_id", "gene_id"], how="left")
        .join(species, on="species_id", how="left")
        .rename({"description": "annotation"})
        .select(columns)
        .collect()
        .to_dicts()
    )

    return GenesResponse(results=[GeneAnnotation(**result) for result in results])


@app.post("/api/clustering")
async def clustering(submitted_file: UploadFile):
    pass
