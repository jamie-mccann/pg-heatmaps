import {
  HierarchicalClusteringArgs,
  Node,
} from "./types";
import {
  DistanceMetrics,
} from "./metrics";
import {
  LinkageMetrics,
} from "./linkages";
import { findNodesToMerge, ladderizeTree, preorderLeafTraversal } from "./utils";

export const hierarchicalClustering = ({
  data = [],
  distanceMetric = "euclidean",
  linkageMetric = "ward",
}: HierarchicalClusteringArgs): number[] => {
  // clustering is meaningless or trivial if 0 <= data.length < 2
  if (data.length < 2) return data.length === 0 ? [] : [0];

  const distance = DistanceMetrics[distanceMetric];
  const linkage = LinkageMetrics[linkageMetric];

  const distances = data.map((row) =>
    data.map((otherRow) => distance(row, otherRow))
  );

  const nodes: Node[] = data.map((_, index) => ({
    id: index,
    parent: null,
    children: [],
    height: 0,
    indices: [index],
  }));

  const root = nodes.reduce((remainingNodes) => {
    return findNodesToMerge(remainingNodes, data, distances, linkage);
  }, nodes)[0];

  ladderizeTree(root);

  return preorderLeafTraversal(root);
};
