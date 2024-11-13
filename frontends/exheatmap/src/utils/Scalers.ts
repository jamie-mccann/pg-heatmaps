import { scaleLinear } from "d3-scale";
import { getVectors } from "../services/clustering/utils";

const arrayRange = (start: number, stop: number, step: number): number[] =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (_, index) => start + index * step
  );

interface ScalerArgs {
  data: number[];
  nrows: number;
  ncols: number;
}

interface Scaler {
  name: string;
  function: (args: ScalerArgs) => number[];
}

const rowScaler = ({ data, nrows, ncols }: ScalerArgs): number[] => {
  return arrayRange(0, nrows * ncols - 1, ncols).flatMap((value) => {
    const dataSlice = data.slice(value, value + ncols);
    const filteredDataSlice =
      dataSlice.filter((value) => value !== 0).length === 0
        ? Array.from({ length: dataSlice.length }, (_, __) => Number.NaN)
        : dataSlice;
    const min = Math.min(...filteredDataSlice);
    const max = Math.max(...filteredDataSlice);
    const mapper = scaleLinear([min, max], [0, 1]);
    return dataSlice.map((value) => 1 - mapper(value));
  });
};

const columnScaler = ({ data, nrows, ncols }: ScalerArgs): number[] => {
  const scaledDataColumnMajor = arrayRange(0, ncols - 1, 1).flatMap(
    (outerValue) => {
      const dataSlice = arrayRange(0, nrows * ncols - 1, ncols).map(
        (innerValue) => data[outerValue + innerValue]
      );
      const min = Math.min(...dataSlice);
      const max = Math.max(...dataSlice);
      const mapper = scaleLinear([min, max], [0, 1]);
      return dataSlice.map((value) => 1 - mapper(value));
      // return max === 0
      //   ? dataSlice.map((_) => 1)
      //   : dataSlice.map((value) => 1 - value / max);
    }
  );

  return arrayRange(0, nrows - 1, 1).flatMap((rowIndex) =>
    arrayRange(0, ncols - 1, 1).map(
      (colIndex) => scaledDataColumnMajor[colIndex * nrows + rowIndex]
    )
  );
};

// const matrixScaler = ({ data }: ScalerArgs): number[] => {
//   const max = Math.max(...data);
//   return max === 0 ? data : data.map((value) => 1 - value / max);
// };

const logScaler = ({ data }: ScalerArgs): number[] => {
  const logData = data.map((value) => Math.log2(value + 1));
  const unitIntervalMap = scaleLinear(
    [Math.min(...logData), Math.max(...logData)],
    [0, 1]
  );
  return logData.map((value) => 1 - unitIntervalMap(value));
};

const noneScaler = ({ data }: ScalerArgs): number[] => {
  const unitIntervalMap = scaleLinear([0, Math.max(...data)], [0, 1]);
  return data.map((value) => 1 - unitIntervalMap(value));
};

const zScoreScaler = ({ data, nrows, ncols }: ScalerArgs): number[] => {
  const logScaledData = data.map((value) => Math.log2(value + 1));
  // const logScaledData = data;
  const dataVectors = getVectors(logScaledData, nrows, ncols, "row");
  const meanVectors = dataVectors.map(
    (value) =>
      value.reduce((sum, currentValue) => sum + currentValue, 0) / value.length
  );

  const varianceVectors = dataVectors.map((value, index) =>
    value.reduce(
      (sum, currentValue) => sum + (currentValue - meanVectors[index]) ** 2
    )
  );

  const zScaledDataVectors = dataVectors.map((value, index) =>
    value.map((innerValue) =>
      varianceVectors[index] !== 0
        ? (innerValue - meanVectors[index]) / Math.sqrt(varianceVectors[index])
        : Number.NaN
    )
  );

  const mappers = zScaledDataVectors.map((value) =>
    scaleLinear([Math.min(...value), Math.max(...value)], [0, 1])
  );

  return zScaledDataVectors
    .map((value, index) =>
      value.map((innerValue) => 1 - mappers[index](innerValue))
    )
    .flat();
};

export const DataScalers: Record<string, Scaler> = {
  row: { name: "row", function: rowScaler },
  column: { name: "column", function: columnScaler },
  // matrix: { name: "matrix", function: matrixScaler },
  log: { name: "log", function: logScaler },
  zscore: { name: "zscore", function: zScoreScaler },
  none: { name: "none", function: noneScaler },
};
