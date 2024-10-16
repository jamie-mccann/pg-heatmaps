import { RefObject, useEffect, useState } from "react";

import { select } from "d3-selection";
import { interpolateRdYlBu } from "d3-scale-chromatic";
import { ScaleLinear } from "d3-scale";
import { range } from "d3";

interface MaxTextLengthsProps {
  svgReference: RefObject<SVGSVGElement>;
  rowLabels: string[];
  colLabels: string[];
  labelFontSize: number;
}

export const useMaxTextLengths = ({
  svgReference,
  rowLabels,
  colLabels,
  labelFontSize,
}: MaxTextLengthsProps) => {
  const [rowTextLength, setRowTextLength] = useState<number | null>(null);
  const [colTextLength, setColTextLength] = useState<number | null>(null);

  useEffect(() => {
    const rowTextLengths = rowLabels.map((value) => {
      const textEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      textEl.setAttribute("visibility", "hidden");
      textEl.setAttribute("font-size", `${labelFontSize}`);
      textEl.textContent = value;
      svgReference.current?.appendChild(textEl);
      const length = textEl.getComputedTextLength();
      svgReference.current?.removeChild(textEl);
      return length;
    });

    const colTextLengths = colLabels.map((value) => {
      const textEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      textEl.setAttribute("visibility", "hidden");
      textEl.setAttribute("font-size", `${labelFontSize}`);
      textEl.textContent = value;
      svgReference.current?.appendChild(textEl);
      const length = textEl.getComputedTextLength();
      svgReference.current?.removeChild(textEl);
      return length;
    });

    setRowTextLength(Math.max(...rowTextLengths));
    setColTextLength(Math.max(...colTextLengths));
    console.log(rowTextLength, colTextLength);
  }, [rowLabels, colLabels, svgReference]);

  return { rowTextLength, colTextLength };
};

interface GenerateHeatMapRectanglesArgs {
  svgReference: RefObject<SVGSVGElement>;
  numberOfRows: number;
  numberOfCols: number;
  cellValues: number[];
  cellValueScaleFunction?: (value: number) => number;
  xScaler?: ScaleLinear<number, number>;
  yScaler?: ScaleLinear<number, number>;
  cellPadding?: number;
}

export const useHeatMapRectangles = ({
  svgReference,
  numberOfRows,
  numberOfCols,
  cellValues,
  xScaler,
  yScaler,
  cellPadding,
  cellValueScaleFunction = (value) => Math.log2(1 + value),
}: GenerateHeatMapRectanglesArgs) => {
  useEffect(() => {
    if (!cellValues || !svgReference) return;
    if (xScaler === undefined || yScaler === undefined) return;
    // if (svgReference.current === null) return;

    const valuesScaled = cellValueScaleFunction
      ? cellValues.map(cellValueScaleFunction)
      : cellValues;

    const maxCellValue = Math.max(...valuesScaled);
    const data = range(numberOfRows)
      .flatMap((row) => range(numberOfCols).map((col) => [row, col]))
      .map((coord, i) => ({
        row: coord[0],
        col: coord[1],
        value: 1 - valuesScaled[i] / maxCellValue,
      }));

    const heatmapRectsGroup = select(svgReference.current)
      .append("g")
      .attr("class", "heatmap-rects");

    heatmapRectsGroup
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => xScaler(d.col))
      .attr("y", (d) => yScaler(d.row))
      .attr("width", Math.abs(xScaler(0) - xScaler(1)) - (cellPadding ?? 1))
      .attr("height", Math.abs(yScaler(0) - yScaler(1)) - (cellPadding ?? 1))
      .attr("fill", (d) => interpolateRdYlBu(d.value))
      .attr("stroke", "white")
      .attr("stroke-width", "1")
      .on("mouseenter", function () {
        select(this).transition().duration(300).attr("stroke", "black");
      })
      .on("mouseleave", function () {
        select(this).transition().duration(300).attr("stroke", "white");
      });
  }, [svgReference, cellValues, xScaler, yScaler]);
};
