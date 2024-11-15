import { create } from "zustand";

import {
  ClusteringSlice,
  ExpressionSlice,
  GenesSlice,
  HeatmapSlice,
  SvgCanvasSlice,
} from "./SliceTypes";

import {
  createClusteringSlice,
  createExpressionSlice,
  createGenesSlice,
  createHeatmapSlice,
  createSvgCanvasSlice,
} from "./SliceCreators";

export const useAppStore = create<
  ClusteringSlice & ExpressionSlice & GenesSlice & HeatmapSlice & SvgCanvasSlice
>()((...storeArgs) => ({
  ...createClusteringSlice(...storeArgs),
  ...createExpressionSlice(...storeArgs),
  ...createHeatmapSlice(...storeArgs),
  ...createGenesSlice(...storeArgs),
  ...createSvgCanvasSlice(...storeArgs),
}));
