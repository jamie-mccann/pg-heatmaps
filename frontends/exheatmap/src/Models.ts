export interface AnnotationsRequest {
  species: string;
  geneIds: string[];
}

export interface ExpressionRequest {
  species: string;
  experimentId: number;
  geneIds: string[];
}

export interface GeneAnnotation {
  chromosomeId: string;
  geneId: string;
  tool: string;
  evalue: number;
  score: number;
  seed_ortholog: string;
  description: string;
}

export interface AnnotationsResponse {
  results: GeneAnnotation[];
}

export interface GeneInfo {
  chromosomeId: string;
  geneId: string;
}

export interface SampleInfo {
  experiment: string;
  sampleId: string;
  reference: string;
  sequencingId: string;
  condition: string;
}

export interface ExpressionResponse {
  genes: GeneInfo[];
  samples: SampleInfo[];
  values: number[];
}

export const ExperimentTitleToId: { [key: string]: number } = {
  "Picea abies Cold Stress Roots": 1,
  "Picea abies Cold Stress Needles": 2,
  "Picea abies Drought Stress Roots": 3,
  "Picea abies Drought Stress Needles": 4,
  "Pinus sylvestris Cold Stress Roots": 5,
  "Pinus sylvestris Cold Stress Needles": 6,
  "Pinus sylvestris Drought Stress Roots": 7,
  "Pinus sylvestris Drought Stress Needles": 8,
  "Picea abies Somatic Embryogenesis": 9,
  "Picea abies Zygotic Embryogenesis": 10,
  "Picea abies ExAtlas": 11,
};

export interface HeatmapMarginConfig {
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
}

export interface HeatmapLabelConfig {
  labelFontSize: number;
  labelPadding: number;
}

export interface HeatmapCellConfig {
  cellPadding: number;
  cellHeight: number;
}

export interface HeatmapSettings {
  marginConfig: HeatmapMarginConfig;
  labelConfig: HeatmapLabelConfig;
  cellConfig: HeatmapCellConfig;
  data: number[],
  rowLabels: string[],
  colLabels: string[]
}
