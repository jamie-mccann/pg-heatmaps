import { StateCreator } from "zustand";

import { FilePickerSlice, SpeciesSelectSlice, ThemeControllerSlice } from "./SliceTypes";

export const createFileSlice: StateCreator<
  FilePickerSlice,
  [],
  [],
  FilePickerSlice
> = (set) => ({
  file: null,
  setFile: (newFile) => set({ file: newFile }),
});

export const createThemeControllerSlice: StateCreator<ThemeControllerSlice> = (
  set
) => ({
  style: "dark",
  setStyle: (newStyle) => set({ style: newStyle }),
});

export const createSpeciesSelectSlice: StateCreator<SpeciesSelectSlice> = (set) => ({
  species: null,
  setSpecies: (newSpecies) => set({ species: newSpecies }),
});
