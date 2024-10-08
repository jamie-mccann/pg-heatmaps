import { create } from "zustand";
import { persist } from "zustand/middleware";

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
>()(
  persist(
    (...storeArgs) => ({
      ...createFileSlice(...storeArgs),
      ...createThemeControllerSlice(...storeArgs),
      ...createSpeciesSelectSlice(...storeArgs),
    }),
    { name: "app-store" }
  ),
);
