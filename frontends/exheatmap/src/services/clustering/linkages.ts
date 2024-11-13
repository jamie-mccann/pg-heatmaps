import { euclideanDistance } from "./metrics";
import { NodeLinkage } from "./types";

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

export const LinkageMetrics: Record<string, NodeLinkage> = {
  average: averageNodeDistance,
  ward: wardNodeDistance,
};
