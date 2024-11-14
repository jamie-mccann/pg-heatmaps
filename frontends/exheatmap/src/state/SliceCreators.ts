import { StateCreator } from "zustand";
import {
  ClusteringSlice,
  ExpressionSlice,
  GenesSlice,
  HeatmapSlice,
  SvgCanvasSlice,
} from "./SliceTypes";

export const createHeatmapSlice: StateCreator<
  HeatmapSlice,
  [],
  [],
  HeatmapSlice
> = (set) => ({
  species: null,
  experiment: null,
  scaler: "log",
  setSpecies: (newSpecies) => set({ species: newSpecies }),
  setExperiment: (newExperiment) => set({ experiment: newExperiment }),
  setScaler: (newScaler: string) => set({ scaler: newScaler }),
});

export const createGenesSlice: StateCreator<GenesSlice, [], [], GenesSlice> = (
  set
) => ({
  geneIds: [],
  geneAnnotations: [],
  selectedGenes: [],
  setGeneIds: (ids) => set({ geneIds: ids }),
  // setGeneAnnotations: (annotations) => set({ geneAnnotations: annotations }),
  setGeneAnnotations: (annotations) =>
    set({
      geneAnnotations: annotations,
      selectedGenes: annotations.map(() => true),
    }),
  setSelectedGenes: (selected) => set({ selectedGenes: selected }),
});

export const createSvgCanvasSlice: StateCreator<SvgCanvasSlice> = (set) => ({
  svgRef: null,
  setSvgRef: (ref) => set({ svgRef: ref }),
  svgHeight: 0,
  svgWidth: 0,
  setDimensions: (w, h) => set({ svgHeight: h, svgWidth: w }),
  setSvgHeight: (h) => set({ svgHeight: h }),
  setSvgWidth: (w) => set({ svgWidth: w }),
});

export const createExpressionSlice: StateCreator<ExpressionSlice> = (set) => ({
  expressionGenes: [],
  expressionSamples: [],
  expressionValues: [],
  setExpressionData: (response) =>
    set({
      expressionGenes: response.genes,
      expressionSamples: response.samples,
      expressionValues: response.values,
    }),
});

export const createClusteringSlice: StateCreator<
  ClusteringSlice,
  [],
  [],
  ClusteringSlice
> = (set) => ({
  metric: "euclidean",
  linkage: "ward",
  axis: "row",
  clusteringRowOrder: [],
  clusteringColOrder: [],
  setMetric: (newMetric: string) => set({ metric: newMetric }),
  setLinkage: (newLinkage: string) => set({ linkage: newLinkage }),
  setAxis: (newAxis: string) => set({ axis: newAxis }),
});
