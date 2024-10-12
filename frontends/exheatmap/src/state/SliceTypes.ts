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

export interface GenesSlice {
  geneIds: string[];
  setGeneIds: (ids: string[]) => void;
  geneAnnotations: GeneAnnotation[];
  setGeneAnnotations: (annotations: GeneAnnotation[]) => void;
}
