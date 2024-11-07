import { scaleLinear } from "d3-scale";

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
    const min = Math.min(...dataSlice);
    const max = Math.max(...dataSlice);
    const mapper = scaleLinear([min, max], [0, 1]);
    return dataSlice.map((value) => 1 - mapper(value));
    // return max === 0
    //   ? dataSlice.map((_) => 1)
    //   : dataSlice.map((value) => 1 - value / max);
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
  const unitIntervalMap = scaleLinear([0, Math.max(...logData)], [0, 1]);
  return logData.map((value) => 1 - unitIntervalMap(value));
};

const noneScaler = ({ data }: ScalerArgs): number[] => {
  const unitIntervalMap = scaleLinear([0, Math.max(...data)], [0, 1]);
  return data.map((value) => 1 - unitIntervalMap(value));
};

const zScoreScaler = ({ data }: ScalerArgs): number[] => {
  const logScaledData = data.map((value) => Math.log2(value + 1));
  const mean =
    logScaledData.reduce((sum, currentValue) => sum + currentValue, 0) /
    data.length;
  const variance =
    logScaledData.reduce(
      (sum, currentValue) => sum + (currentValue - mean) ** 2,
      0
    ) / data.length;
  const zScaledData = logScaledData.map(
    (value) => (value - mean) / Math.sqrt(variance)
  );
  // const mapper = scaleLinear(
  //   [Math.min(...zScaledData), Math.max(...zScaledData)],
  //   [0, 1]
  // );
  // return zScaledData.map((value) => 1 - mapper(value));
  return zScaledData;
};

export const DataScalers: Record<string, Scaler> = {
  row: { name: "row", function: rowScaler },
  column: { name: "column", function: columnScaler },
  // matrix: { name: "matrix", function: matrixScaler },
  log: { name: "log", function: logScaler },
  zscore: { name: "zscore", function: zScoreScaler },
  none: { name: "none", function: noneScaler },
};
