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
import {
  createReorderedColMapper,
  createReorderedIndexMapper,
  createReorderedRowMapper,
} from "../services/clustering/utils";
import { useClustering } from "../hooks/useClustering";
import { useMaxTextLength } from "../hooks/useMaxTextLength";

const Heatmap = ({
  marginConfig: { marginTop, marginBottom, marginLeft, marginRight },
  labelConfig: { labelFontSize, labelPadding },
  cellConfig: { cellPadding, cellHeight },
  data,
  rowLabels,
  colLabels,
}: HeatmapSettings) => {
  const svgRef = useAppStore((state) => state.svgRef);
  const svgWidth = useAppStore((state) => state.svgWidth);
  const svgHeight = useAppStore((state) => state.svgHeight);

  const rowTextLength = useMaxTextLength({
    texts: rowLabels,
    fontSize: labelFontSize,
    rotation: 0,
  });

  const colTextLength = useMaxTextLength({
    texts: colLabels,
    fontSize: labelFontSize,
    rotation: -45,
  });

  const { rowOrder, colOrder, values } = useClustering(
    data,
    rowLabels.length,
    colLabels.length
  );

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

  const reorderedIndexMap = useMemo(
    () => createReorderedIndexMapper(rowOrder, colOrder),
    [rowOrder, colOrder]
  );

  const reorderedRowMap = useMemo(
    () => createReorderedRowMapper(rowOrder, colOrder.length),
    [rowOrder, colOrder]
  );

  const reorderedColMap = useMemo(
    () => createReorderedColMapper(colOrder),
    [colOrder]
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
              Number.isNaN(values[reorderedIndexMap(index)])
                ? gray(50).toString()
                : interpolateRdYlBu(values[reorderedIndexMap(index)])
            }
            strokeWidth={1}
            stroke="white"
            data-row-label={orderedRowLabels[reorderedRowMap(index)]}
            data-col-label={orderedColLabels[reorderedColMap(index)]}
            data-cell-value={data[reorderedIndexMap(index)]}
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
