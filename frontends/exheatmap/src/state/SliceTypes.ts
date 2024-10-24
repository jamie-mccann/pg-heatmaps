import { GeneAnnotation } from "../models";

export interface HeatmapSlice {
  species: string | null;
  experiment: string | null;
  setSpecies: (newSpecies: string | null) => void;
  setExperiment: (newExperiment: string | null) => void;
}

export interface GenesSlice {
  geneIds: string[];
  setGeneIds: (ids: string[]) => void;
  geneAnnotations: GeneAnnotation[];
  setGeneAnnotations: (annotations: GeneAnnotation[]) => void;
}
