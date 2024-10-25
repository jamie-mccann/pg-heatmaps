import { create } from "zustand";

import { GenesSlice, HeatmapSlice, SvgCanvasSlice } from "./SliceTypes";
import { createGenesSlice, createHeatmapSlice, createSvgCanvasSlice } from "./SliceCreators";

export const useAppStore = create<GenesSlice & HeatmapSlice & SvgCanvasSlice>()((...storeArgs) => ({
  ...createHeatmapSlice(...storeArgs),
  ...createGenesSlice(...storeArgs),
  ...createSvgCanvasSlice(...storeArgs),
}));
