import { Node, NodeLinkage } from "./types";

// Helper function to reshape flattened data into 2D matrix
export const getVectors = (
  data: number[],
  nrows: number,
  ncols: number,
  axis: string
): number[][] => {
  if (axis !== "row" && axis !== "col") {
    throw new Error(`axis=${axis} must be either 'row' or 'col'`);
  }
  const numVectors = axis === "row" ? nrows : ncols;
  const vectorLength = axis === "row" ? ncols : nrows;

  return Array.from({ length: numVectors }, (_, i) =>
    Array.from({ length: vectorLength }, (_, j) =>
      axis === "row" ? data[i * ncols + j] : data[j * ncols + i]
    )
  );
};

export const reshapeData = (
  data: number[],
  rowOrder: number[],
  colOrder: number[]
): number[] => {
  const nrows = rowOrder.length;
  const ncols = colOrder.length;
  const computedDataLength = nrows * ncols;
  const inputDataLength = data.length;

  if (computedDataLength !== inputDataLength) {
    throw new Error(
      `${nrows} * ${ncols} = ${computedDataLength} !== ${inputDataLength} shapes mismatch!`
    );
  }

  return rowOrder.flatMap((rowIndex) =>
    colOrder.map((colIndex) => data[rowIndex * ncols + colIndex])
  );
};

export const reshapedDataMap = (rowOrder: number[], colOrder: number[]) => {
  const ncols = colOrder.length;

  return rowOrder.flatMap((rowIndex) =>
    colOrder.map((colIndex) => rowIndex * ncols + colIndex)
  );
};

export const getReorderedIndex = (
  rowOrder: number[],
  colOrder: number[],
  index: number
): number =>
  // index = rowIndex * colOrder.length + colIndex where
  // rowIndex = Math.floor(index / colOrder.length) and
  // colIndex = rem(index, colOrder.length)
  rowOrder[Math.floor(index / colOrder.length)] * colOrder.length +
  colOrder[index % colOrder.length];

export const createReorderedIndexMapper =
  (rowOrder: number[], colOrder: number[]): ((index: number) => number) =>
  (index: number) =>
    rowOrder[Math.floor(index / colOrder.length)] * colOrder.length +
    colOrder[index % colOrder.length];

export const createReorderedRowMapper =
  (rowOrder: number[], numCols: number): ((index: number) => number) =>
  (index: number) =>
    rowOrder[Math.floor(index / numCols)];

export const createReorderedColMapper =
  (colOrder: number[]): ((index: number) => number) =>
  (index: number) =>
    colOrder[index % colOrder.length];

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

export const preorderLeafTraversal = (node: Node): number[] =>
  node.children.length === 0
    ? [node.id]
    : node.children.reduce<number[]>(
        (acc, child) => acc.concat(preorderLeafTraversal(child)),
        []
      );

export const getSubtreeSize = (node: Node): number =>
  node.children.length === 0
    ? 1
    : node.children.reduce<number>(
        (acc, child) => acc + getSubtreeSize(child),
        0
      );

export const ladderizeTree = (node: Node): void =>
  node.children
    .sort((a, b) => getSubtreeSize(b) - getSubtreeSize(a))
    .forEach(ladderizeTree);
