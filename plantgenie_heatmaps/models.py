from typing import List, Optional

from pydantic import BaseModel, Field


class GeneList(BaseModel):
    species: str
    experiment: str
    gene_ids: List[str] = Field(alias="geneIds")


class GeneInfo(BaseModel):
    chromosome_id: str = Field(alias="chromosomeId")
    gene_id: str = Field(alias="geneId")


class SampleInfo(BaseModel):
    experiment_id: str = Field(alias="ExperimentId")
    replicate_id: int
    stub: str
    experiment_description: str


class ExpressionResponse(BaseModel):
    genes: List[GeneInfo]
    samples: List[SampleInfo]
    values: List[float]


# class GeneAnnotation(BaseModel):
#     chromosome_id: str = Field(alias="chromosomeId")
#     gene_id: str = Field(alias="geneId")
#     genus: Optional[str]
#     species: Optional[str]
#     tool: Optional[str]
#     annotation: Optional[str]
#     evalue: Optional[float]
#     score: Optional[float]


class GeneAnnotation(BaseModel):
    chromosome_id: str = Field(alias="chromosomeId")
    gene_id: str = Field(alias="geneId")
    tool: Optional[str]
    evalue: Optional[float]
    score: Optional[float]
    seed_ortholog: Optional[str]
    description: Optional[str]

class GenesResponse(BaseModel):
    results: List[GeneAnnotation]
