import { StateCreator } from "zustand";
import { GenesSlice } from "./SliceTypes";

export const createGenesSlice: StateCreator<GenesSlice, [], [], GenesSlice> = (set) => ({
  geneIds: [],
  geneAnnotations: [],
  setGeneIds: (ids) => set({geneIds: ids}),
  setGeneAnnotations: (annotations) => set({geneAnnotations: annotations})
});

