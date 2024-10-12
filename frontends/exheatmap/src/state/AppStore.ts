import { create } from "zustand";

import { GenesSlice } from "./SliceTypes";
import { createGenesSlice } from "./SliceCreators";

export const useAppStore = create<GenesSlice>()((...storeArgs) => ({
  ...createGenesSlice(...storeArgs),
}));
