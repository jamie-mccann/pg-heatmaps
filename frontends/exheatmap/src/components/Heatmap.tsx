import { useEffect, useLayoutEffect, useMemo, useState } from "react";

import Typography from "@mui/material/Typography";

import { range } from "d3";
import { gray } from "d3-color";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { interpolateRdYlBu } from "d3-scale-chromatic";

import { useAppStore } from "../state/AppStore";
import { HeatmapSettings } from "../Models";
import HeatmapTooltip from "./HeatmapTooltip";
import { DataScalers } from "../utils/Scalers";
import { hierarchicalClustering } from "../services/clustering/cluster";
import {
  getVectors,
  getReorderedIndex,
} from "../services/clustering/utils";

const Heatmap = ({
  marginConfig: { marginTop, marginBottom, marginLeft, marginRight },
  labelConfig: { labelFontSize, labelPadding },
  cellConfig: { cellPadding, cellHeight },
  data,
  rowLabels,
  colLabels,
}: HeatmapSettings) => {
  const dataScaler = useAppStore((state) => state.scaler);
  const clusteringAxis = useAppStore((state) => state.axis);
  const clusteringMetric = useAppStore((state) => state.metric);
  const clusteringLinkage = useAppStore((state) => state.linkage);
  const svgRef = useAppStore((state) => state.svgRef);
  const svgWidth = useAppStore((state) => state.svgWidth);
  const svgHeight = useAppStore((state) => state.svgHeight);
  // local state
  const [rowTextLength, setRowTextLength] = useState<number>(0);
  const [colTextLength, setColTextLength] = useState<number>(0);
  // local data state
  const [values, setValues] = useState<number[]>([]);
  const [rowOrder, setRowOrder] = useState<number[]>([]);
  const [colOrder, setColOrder] = useState<number[]>([]);

  useLayoutEffect(() => {
    const hiddenSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    hiddenSvg.setAttribute("visibility", "hidden");
    document.body.appendChild(hiddenSvg);

    const xTextLengths = rowLabels.map((value) => {
      const textEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      textEl.setAttribute("visibility", "hidden");
      textEl.setAttribute("font-size", `${labelFontSize}`);
      textEl.textContent = value;
      hiddenSvg.appendChild(textEl);
      const length = textEl.getComputedTextLength();
      hiddenSvg.removeChild(textEl);
      return length;
    });

    setRowTextLength(Math.max(...xTextLengths));

    const yTextLengths = colLabels.map((value) => {
      const textEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      textEl.setAttribute("visibility", "hidden");
      textEl.setAttribute("font-size", `${labelFontSize}`);
      textEl.textContent = value;
      hiddenSvg.appendChild(textEl);
      const length = textEl.getComputedTextLength();
      hiddenSvg.removeChild(textEl);
      return length;
    });

    setColTextLength(Math.max(...yTextLengths));

    const newSvgHeight =
      marginBottom +
      marginTop +
      Math.max(...yTextLengths) * Math.sin(Math.PI / 4) +
      labelPadding +
      cellHeight * rowLabels.length;
    cellPadding * (rowLabels.length + 1);
    console.log(`New SVG Height: ${newSvgHeight}`);

    document.body.removeChild(hiddenSvg);
  }, []);

  // clustering effect
  useEffect(() => {
    const scaledData = DataScalers[dataScaler].function({
      data: data,
      nrows: rowLabels.length,
      ncols: colLabels.length,
    });
    const newRowOrder =
      clusteringAxis === "row" || clusteringAxis === "both"
        ? hierarchicalClustering({
            data: getVectors(
              scaledData,
              rowLabels.length,
              colLabels.length,
              "row"
            ),
            distanceMetric: clusteringMetric,
            linkageMetric: clusteringLinkage,
            by: "row",
          })
        : Array.from({ length: rowLabels.length }, (_, index) => index);

    const newColOrder =
      clusteringAxis === "col" || clusteringAxis === "both"
        ? hierarchicalClustering({
            data: getVectors(
              scaledData,
              rowLabels.length,
              colLabels.length,
              "col"
            ),
            distanceMetric: clusteringMetric,
            linkageMetric: clusteringLinkage,
            by: "col",
          })
        : Array.from({ length: colLabels.length }, (_, index) => index);

    setRowOrder(newRowOrder);
    setColOrder(newColOrder);
    setValues(scaledData);
  }, [
    svgRef,
    dataScaler,
    clusteringAxis,
    clusteringMetric,
    clusteringLinkage,
    data,
  ]);

  // d3 animations effect
  useEffect(() => {
    if (svgRef === null) return;

    select(svgRef.current)
      .select("#rectangles")
      .selectAll("rect")
      .on("mouseenter", function () {
        select(this).transition().duration(300).style("stroke", "black");
      })
      .on("mouseleave", function () {
        select(this).transition().duration(300).style("stroke", "white");
      });

    select(svgRef.current)
      .select("#row-labels")
      .selectAll("text")
      .on("mouseenter", function () {
        select(this).transition().duration(300).attr("font-weight", "bold");
      })
      .on("mouseleave", function () {
        select(this).transition().duration(300).attr("font-weight", "normal");
      });

    select(svgRef.current)
      .select("#col-labels")
      .selectAll("text")
      .on("mouseenter", function () {
        select(this).transition().duration(300).attr("font-weight", "bold");
      })
      .on("mouseleave", function () {
        select(this).transition().duration(300).attr("font-weight", "normal");
      });
  }, [svgRef, rowOrder, colOrder]);

  const heatmapBounds = {
    top: marginTop + colTextLength * Math.sin(Math.PI / 4) + labelPadding,
    bottom: svgHeight - marginBottom,
    left: marginLeft,
    right: svgWidth - marginRight - rowTextLength - labelPadding,
  };

  const xAxisScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, colLabels.length])
        .range([heatmapBounds.left, heatmapBounds.right]),
    [svgWidth, rowTextLength]
  );

  const yAxisScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, rowLabels.length])
        .range([heatmapBounds.top, heatmapBounds.bottom]),
    [svgHeight, colTextLength]
  );

  const matrixIndices = useMemo(
    () =>
      range(rowLabels.length).flatMap((row) =>
        range(colLabels.length).map((col) => [row, col])
      ),
    [rowLabels, colLabels]
  );

  const orderedRowLabels = rowOrder.map((value) => rowLabels[value]);

  const orderedColLabels = colOrder.map((value) => colLabels[value]);

  if (svgWidth === 0 || rowTextLength === 0) {
    return <Typography variant="h3">Rendering heatmap ...</Typography>;
  }

  return (
    <>
      <rect
        id="svg-background"
        fill="#1E1E1E"
        width={svgWidth}
        height={svgHeight}
        rx={5}
        ry={5}
      ></rect>
      <rect
        id="heatmap-background"
        fill="white"
        strokeWidth={1}
        stroke="white"
        rx={1}
        ry={1}
        x={heatmapBounds.left - 1}
        y={heatmapBounds.top - 1}
        width={heatmapBounds.right - heatmapBounds.left + 1}
        height={heatmapBounds.bottom - heatmapBounds.top + 1}
      ></rect>
      <g id="rectangles">
        {data.map((_, index) => (
          <rect
            className="tooltip-trigger"
            key={index}
            x={xAxisScale(matrixIndices[index][1])}
            y={yAxisScale(matrixIndices[index][0])}
            width={Math.abs(xAxisScale(0) - xAxisScale(1)) - cellPadding}
            height={Math.abs(yAxisScale(0) - yAxisScale(1)) - cellPadding}
            fill={
              Number.isNaN(values[getReorderedIndex(rowOrder, colOrder, index)])
                ? gray(50).toString()
                : interpolateRdYlBu(
                    values[getReorderedIndex(rowOrder, colOrder, index)]
                  )
            }
            strokeWidth={1}
            stroke="white"
            data-row-label={orderedRowLabels[matrixIndices[index][0]]}
            data-col-label={orderedColLabels[matrixIndices[index][1]]}
            data-cell-value={data[getReorderedIndex(rowOrder, colOrder, index)]}
            rx={1}
            ry={1}
          ></rect>
        ))}
      </g>
      <g id="row-labels">
        {rowOrder.map((value, index) => (
          <text
            key={index}
            transform={`translate(${svgWidth - marginRight - rowTextLength}, ${
              (yAxisScale(index) + yAxisScale(index + 1)) / 2
            })`}
            fontSize={labelFontSize}
            fontFamily="Roboto"
            textAnchor="left"
            dominantBaseline="middle"
            fontWeight="normal"
            fill="lightgrey"
          >
            {rowLabels[value]}
          </text>
        ))}
      </g>
      <g id="col-labels">
        {colOrder.map((value, index) => (
          <text
            key={index}
            transform={`translate(${
              (xAxisScale(index) + xAxisScale(index + 1)) / 2
            },${
              marginTop + colTextLength * Math.sin(Math.PI / 4)
            }) rotate(-45)`}
            fontSize={labelFontSize}
            fontFamily="Roboto"
            textAnchor="left"
            dominantBaseline="middle"
            fontWeight="normal"
            fill="lightgrey"
          >
            {colLabels[value]}
          </text>
        ))}
      </g>
      <HeatmapTooltip />
    </>
  );
};

export default Heatmap;
