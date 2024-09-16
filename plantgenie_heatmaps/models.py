from typing import List

from pydantic import BaseModel


class GeneList(BaseModel):
    gene_ids: List[str]


class ExpressionResult(BaseModel):
    chromosome_id: str
    gene_id: str
    genus: str
    species: str
    experiment_id: str
    replicate_id: int
    stub: str
    experiment_description: str
    result: float
    result_type: str
    tool: str
    annotation: str
    evalue: float
    score: float


class ExpressionResponse(BaseModel):
    results: List[ExpressionResult]


class GeneAnnotation(BaseModel):
    chromosome_id: str
    gene_id: str
    genus: str
    species: str
    tool: str
    annotation: str
    evalue: float
    score: float


class GenesResponse(BaseModel):
    results: List[GeneAnnotation]
