import { StateCreator } from "zustand";
import { GenesSlice, HeatmapSlice, SvgCanvasSlice } from "./SliceTypes";

export const createHeatmapSlice: StateCreator<
  HeatmapSlice,
  [],
  [],
  HeatmapSlice
> = (set) => ({
  species: null,
  experiment: null,
  scaler: "log",
  metric: "euclidean",
  linkage: "ward",
  setSpecies: (newSpecies) => set({ species: newSpecies }),
  setExperiment: (newExperiment) => set({ experiment: newExperiment }),
  setScaler: (newScaler: string) => set({ scaler: newScaler }),
  setMetric: (newMetric) => set({ metric: newMetric }),
  setLinkage: (newLinkage) => set({ linkage: newLinkage }),
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
