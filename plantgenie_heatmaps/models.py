from typing import List, Optional

from pydantic import BaseModel


class GeneList(BaseModel):
    species: str
    experiment: str
    gene_ids: List[str]


class GeneInfo(BaseModel):
    chromosome_id: str
    gene_id: str


class SampleInfo(BaseModel):
    experiment_id: str
    replicate_id: int
    stub: str
    experiment_description: str


class ExpressionResponse(BaseModel):
    genes: List[GeneInfo]
    samples: List[SampleInfo]
    values: List[float]


class GeneAnnotation(BaseModel):
    chromosome_id: str
    gene_id: str
    genus: Optional[str]
    species: Optional[str]
    tool: Optional[str]
    annotation: Optional[str]
    evalue: Optional[float]
    score: Optional[float]


class GenesResponse(BaseModel):
    results: List[GeneAnnotation]
