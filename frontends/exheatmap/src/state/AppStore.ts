import { create } from "zustand";

import { GenesSlice, HeatmapSlice } from "./SliceTypes";
import { createGenesSlice, createHeatmapSlice } from "./SliceCreators";

export const useAppStore = create<GenesSlice & HeatmapSlice>()((...storeArgs) => ({
  ...createHeatmapSlice(...storeArgs),
  ...createGenesSlice(...storeArgs),
}));
