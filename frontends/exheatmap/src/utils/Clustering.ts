interface Node {
  id: number;
  parent: Node | null;
  children: Node[];
  height: number;
  indices: number[];
}

type DistanceMetric = (a: number[], b: number[]) => number;

interface NodeLinkageArgs {
  firstNode: Node;
  secondNode: Node;
  dataMatrix?: number[][];
  distanceMatrix?: number[][];
}

type NodeLinkage = ({}: NodeLinkageArgs) => number;

interface HierarchicalClusteringArgs {
  data: number[][];
  distance: DistanceMetric;
  linkage: NodeLinkage;
}

export const euclideanDistance: DistanceMetric = (
  a: number[],
  b: number[]
): number =>
  Math.sqrt(
    a
      .map((value, index) => Math.pow(value - b[index], 2))
      .reduce((acc, current) => acc + current, 0)
  );

export const chebyshevDistance: DistanceMetric = (
  a: number[],
  b: number[]
): number => {
  return a.reduce((max, ai, idx) => Math.max(max, Math.abs(ai - b[idx])), 0);
};

export const averageNodeDistance: NodeLinkage = ({
  firstNode,
  secondNode,
  distanceMatrix,
}): number => {
  if (!distanceMatrix) {
    throw new Error("averageNodeDistance requires a distance matrix!");
  }
  return (
    firstNode.indices
      .flatMap((firstIndex) =>
        secondNode.indices.map(
          (secondIndex) => distanceMatrix[firstIndex][secondIndex]
        )
      )
      .reduce((acc, current) => acc + current, 0) /
    firstNode.indices.length /
    secondNode.indices.length
  );
};

export const wardNodeDistance: NodeLinkage = ({
  firstNode,
  secondNode,
  dataMatrix,
}): number => {
  if (!dataMatrix) {
    throw new Error("wardNodeDistance requires a data matrix!");
  }

  const firstCentroid = Array.from(
    { length: dataMatrix[0].length },
    (_, index) =>
      firstNode.indices.reduce(
        (sum, nodeIndex) => sum + dataMatrix[nodeIndex][index],
        0
      ) / firstNode.indices.length
  );

  const secondCentroid = Array.from(
    { length: dataMatrix[0].length },
    (_, index) =>
      secondNode.indices.reduce(
        (sum, nodeIndex) => sum + dataMatrix[nodeIndex][index],
        0
      ) / secondNode.indices.length
  );

  const distanceBetweenCentroids = euclideanDistance(
    firstCentroid,
    secondCentroid
  );

  // Calculate the Ward linkage distance
  return Math.sqrt(
    ((firstNode.indices.length * secondNode.indices.length) /
      (firstNode.indices.length + secondNode.indices.length)) *
      Math.pow(distanceBetweenCentroids, 2)
  );
};

export const findNodesToMerge = (
  nodes: Node[],
  dataMatrix: number[][],
  distanceMatrix: number[][],
  linkage: NodeLinkage
) => {
  if (nodes.length < 2) return nodes;

  const pairs = nodes.slice(0, -1).map((firstNode, firstIndex) => {
    return nodes.slice(firstIndex + 1).map((secondNode, secondIndex) => {
      const result = {
        firstIndex,
        secondIndex: firstIndex + secondIndex + 1,
        distance: linkage({
          firstNode,
          secondNode,
          dataMatrix,
          distanceMatrix,
        }),
      };
      return result;
    });
  });

  const bestPair = pairs
    .flat()
    .reduce((acc, current) =>
      current.distance < acc.distance ? current : acc
    );

  const nextNodeId =
    nodes.reduce((nodeWithLargestId, currentNode) =>
      currentNode.id > nodeWithLargestId.id ? currentNode : nodeWithLargestId
    ).id + 1;

  const newNode: Node = {
    id: nextNodeId,
    height: bestPair.distance,
    parent: null,
    children: [nodes[bestPair.firstIndex], nodes[bestPair.secondIndex]],
    indices: [
      ...nodes[bestPair.firstIndex].indices,
      ...nodes[bestPair.secondIndex].indices,
    ],
  };

  nodes[bestPair.firstIndex].parent = newNode;
  nodes[bestPair.secondIndex].parent = newNode;

  return [
    ...nodes.filter(
      (value) =>
        value.id !== nodes[bestPair.firstIndex].id &&
        value.id !== nodes[bestPair.secondIndex].id
    ),
    newNode,
  ];
};

export const preorderLeafTraversal = (node: Node): number[] => {
  let result: number[] = [];

  // Check if the current node is a leaf
  if (node.children.length === 0) {
    result.push(...node.indices);
  } else {
    // If the node has children, traverse them
    for (const child of node.children) {
      result = result.concat(preorderLeafTraversal(child));
    }
  }

  return result;
};

export const hierarchicalClustering = ({
  data = [],
  distance = euclideanDistance,
  linkage = averageNodeDistance,
}: HierarchicalClusteringArgs): number[] => {
  // clustering is meaningless or trivial if 0 <= data.length < 2
  if (data.length < 2) return data.length === 0 ? [] : [0];

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

  return preorderLeafTraversal(root);
};

export const DistanceMetrics: Record<string, DistanceMetric> = {
  euclidean: euclideanDistance,
  chebyshev: chebyshevDistance,
};

export const LinkageMetrics: Record<string, NodeLinkage> = {
  average: averageNodeDistance,
  ward: wardNodeDistance,
};

export const hierarchicalClusteringUI = (
  data: number[][],
  distanceMetric: string, // "euclidean" | "chebyshev",
  linkageMetric: string // "average" | "ward"
) =>
  hierarchicalClustering({
    data: data,
    distance: DistanceMetrics[distanceMetric],
    linkage: LinkageMetrics[linkageMetric],
  });
