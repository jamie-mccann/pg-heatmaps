export interface GeneListId {
  chromosomeId: string;
  geneId: String;
}

export interface FilePickerSlice {
  file: File | null;
  parsedIds: GeneListId[];
  setFile: (newFile: File | null) => void;
  setParsedIds: (ids: GeneListId[]) => void;
}

export interface ThemeControllerSlice {
  style: "light" | "dark";
  setStyle: (newStyle: "light" | "dark") => void;
}

export interface SpeciesSelectSlice {
  species: string | null;
  setSpecies: (newSpecies: string | null) => void;
}

// class GeneAnnotation(BaseModel):
//     chromosome_id: str
//     gene_id: str
//     genus: str
//     species: str
//     tool: str
//     annotation: str
//     evalue: float
//     score: float

export interface GeneAnnotation {
  chromosome_id: string;
  gene_id: string;
  genus: string;
  species: string;
  tool: string;
  annotation: string;
  evalue: number;
  score: number;
}

export interface GeneListControllerSlice {
  genes: GeneAnnotation[]
  setGenes: null;
}
