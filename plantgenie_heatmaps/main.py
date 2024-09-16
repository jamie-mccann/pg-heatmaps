import os
from pathlib import Path

import polars

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from loguru import logger


from plantgenie_heatmaps.models import (
    ExpressionResponse,
    ExpressionResult,
    GeneList,
    GenesResponse,
    GeneAnnotation,
)

DATA_PATH = (
    Path(os.environ.get("DATA_PATH"))
    or Path(__file__).parent.parent / "example_data"
)
lazy_dataframes = {
    x.stem: polars.scan_csv(x, separator="\t") for x in DATA_PATH.glob("*.tsv")
}

logger.info([x for x in lazy_dataframes])

app_path = Path(__file__).parent
static_files_path = app_path / "pg-react-frontend" / "dist"

app = FastAPI()

app.mount("/static", StaticFiles(directory=static_files_path), name="static")


@app.get("/", include_in_schema=False)
async def root():
    return FileResponse(static_files_path / "index.html")


@app.get("/api")
async def api_root():
    message = {"message": "Hello from API!"}
    message["data_files"] = [p.__str__() for p in DATA_PATH.glob("*")]

    return message


@app.post("/api/expression_data")
async def get_gene_expression_data(request: GeneList) -> ExpressionResponse:
    expression_data_lazy = lazy_dataframes[
        "conifer_networks_tpm_data_reformatted"
    ]
    annotations_lazy = lazy_dataframes["picab_v2p0_gene_annotation_table"]
    species_lazy = lazy_dataframes["species_table"]
    request_pairs = polars.DataFrame(
        data=map(
            lambda s: ("_".join(s.split("_")[:-1]), s.split("_")[-1]),
            request.gene_ids,
        ),
        schema={"chromosome_id": polars.Utf8, "gene_id": polars.Utf8},
    ).lazy()  # as lazy because the other ones are lazy too.

    results = (
        expression_data_lazy.join(
            request_pairs, on=["chromosome_id", "gene_id"], how="inner"
        )
        .join(
            annotations_lazy.join(
                request_pairs, on=["chromosome_id", "gene_id"], how="inner"
            ),
            how="inner",
            on=["chromosome_id", "gene_id"],
        )
        .join(species_lazy, how="inner", on="species_id")
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
        .sort([polars.col("chromosome_id"), polars.col("gene_id")])
    )

    return ExpressionResponse(
        results=[
            ExpressionResult(**result)
            for result in results.collect().to_dicts()
        ]
    )


@app.post("/api/genes")
async def annotations_from_gene_list(request: GeneList) -> GenesResponse:
    annotations = lazy_dataframes["picab_v2p0_gene_annotation_table"]
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
        annotations.join(
            request_pairs.lazy(), on=["chromosome_id", "gene_id"], how="inner"
        )
        .join(species, how="inner", on="species_id")
        .rename({"description": "annotation"})
        .select(columns)
        .collect()
        .to_dicts()
    )

    return GenesResponse(
        results=[GeneAnnotation(**result) for result in results]
    )


@app.get("/api/clustering/")
async def clustering():
    pass
