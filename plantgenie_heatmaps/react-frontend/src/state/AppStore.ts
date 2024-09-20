import { create } from "zustand";

import {
  FilePickerSlice,
  SpeciesSelectSlice,
  ThemeControllerSlice,
} from "./SliceTypes";

import {
  createFileSlice,
  createSpeciesSelectSlice,
  createThemeControllerSlice,
} from "./SliceCreators";

export const useAppStore = create<
  FilePickerSlice & SpeciesSelectSlice & ThemeControllerSlice
>()((...storeArgs) => ({
  ...createFileSlice(...storeArgs),
  ...createThemeControllerSlice(...storeArgs),
  ...createSpeciesSelectSlice(...storeArgs),
}));
