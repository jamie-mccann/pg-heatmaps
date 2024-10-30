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
  setSpecies: (newSpecies) => set({ species: newSpecies}),
  setExperiment: (newExperiment) => set({ experiment: newExperiment}),
});

export const createGenesSlice: StateCreator<GenesSlice, [], [], GenesSlice> = (
  set
) => ({
  geneIds: [],
  geneAnnotations: [],
  setGeneIds: (ids) => set({ geneIds: ids }),
  setGeneAnnotations: (annotations) => set({ geneAnnotations: annotations }),
});

export const createSvgCanvasSlice: StateCreator<SvgCanvasSlice> = (set) => ({
  svgRef: null,
  setSvgRef: (ref) => set({ svgRef: ref }),
  svgHeight: 0,
  svgWidth: 0,
  setDimensions: (w, h) => set({ svgHeight: h, svgWidth: w }),
});
