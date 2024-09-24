import { StateCreator } from "zustand";

import { FilePickerSlice, SpeciesSelectSlice, ThemeControllerSlice } from "./SliceTypes";

export const createFileSlice: StateCreator<
  FilePickerSlice,
  [],
  [],
  FilePickerSlice
> = (set) => ({
  file: null,
  parsedIds: [],
  setFile: (newFile: File | null) => set({ file: newFile }),
  setParsedIds: (ids) => set({ parsedIds: ids })
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
