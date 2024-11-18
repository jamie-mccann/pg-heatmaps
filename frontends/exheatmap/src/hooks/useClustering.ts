import { useEffect, useState } from "react";

import { DataScalers } from "../utils/Scalers";
import { hierarchicalClustering } from "../services/clustering/cluster";
import { getVectors } from "../services/clustering/utils";

import { useAppStore } from "../state/AppStore";

export const useClustering = (data: number[], nrows: number, ncols: number) => {
  const dataScaler = useAppStore((state) => state.scaler);
  const clusteringAxis = useAppStore((state) => state.axis);
  const clusteringMetric = useAppStore((state) => state.metric);
  const clusteringLinkage = useAppStore((state) => state.linkage);

  const [values, setValues] = useState<number[]>([]);
  const [rowOrder, setRowOrder] = useState<number[]>([]);
  const [colOrder, setColOrder] = useState<number[]>([]);

  useEffect(() => {
    const scaledData = DataScalers[dataScaler].function({
      data,
      nrows,
      ncols,
    });
    const newRowOrder =
      clusteringAxis === "row" || clusteringAxis === "both"
        ? hierarchicalClustering({
            data: getVectors(scaledData, nrows, ncols, "row"),
            distanceMetric: clusteringMetric,
            linkageMetric: clusteringLinkage,
            by: "row",
          })
        : Array.from({ length: nrows }, (_, index) => index);

    const newColOrder =
      clusteringAxis === "col" || clusteringAxis === "both"
        ? hierarchicalClustering({
            data: getVectors(scaledData, nrows, ncols, "col"),
            distanceMetric: clusteringMetric,
            linkageMetric: clusteringLinkage,
            by: "col",
          })
        : Array.from({ length: ncols }, (_, index) => index);

    setRowOrder(newRowOrder);
    setColOrder(newColOrder);
    setValues(scaledData);

    return () => {
      setRowOrder([]);
      setColOrder([]);
      setValues([]);
    };
  }, [dataScaler, clusteringAxis, clusteringMetric, clusteringLinkage, data]);

  return { rowOrder, colOrder, values };
};
