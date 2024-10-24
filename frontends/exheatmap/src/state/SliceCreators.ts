import { StateCreator } from "zustand";
import { GenesSlice, HeatmapSlice } from "./SliceTypes";

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
