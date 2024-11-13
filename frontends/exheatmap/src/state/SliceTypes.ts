import {
  ExpressionResponse,
  GeneAnnotation,
  GeneInfo,
  SampleInfo,
} from "../Models";

export interface HeatmapSlice {
  species: string | null;
  experiment: string | null;
  scaler: string;
  setSpecies: (newSpecies: string | null) => void;
  setExperiment: (newExperiment: string | null) => void;
  setScaler: (newScaler: string) => void;
}

export interface GenesSlice {
  geneIds: string[];
  setGeneIds: (ids: string[]) => void;
  geneAnnotations: GeneAnnotation[];
  setGeneAnnotations: (annotations: GeneAnnotation[]) => void;
  selectedGenes: boolean[];
  setSelectedGenes: (selected: boolean[]) => void;
}

export interface SvgCanvasSlice {
  svgRef: React.RefObject<SVGSVGElement> | null;
  setSvgRef: (ref: React.RefObject<SVGSVGElement>) => void;
  svgHeight: number;
  svgWidth: number;
  setDimensions: (w: number, h: number) => void;
  setSvgWidth: (w: number) => void;
  setSvgHeight: (h: number) => void;
}

export interface ExpressionSlice {
  expressionGenes: GeneInfo[];
  expressionSamples: SampleInfo[];
  expressionValues: number[];
  setExpressionData: (response: ExpressionResponse) => void;
}

export interface ClusteringSlice {
  metric: string;
  linkage: string;
  clusterBy: string;
  clusteringRowOrder: number[];
  clusteringColOrder: number[];
  setMetric: (newMetric: string) => void;
  setLinkage: (newLinkage: string) => void;
}
