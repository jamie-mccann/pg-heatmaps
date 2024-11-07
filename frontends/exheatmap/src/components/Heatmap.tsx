import { useEffect, useLayoutEffect, useMemo, useState } from "react";

import { range } from "d3";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { interpolateRdYlBu } from "d3-scale-chromatic";

import { useAppStore } from "../state/AppStore";
import { HeatmapSettings } from "../Models";
import HeatmapTooltip from "./HeatmapTooltip";
import { DataScalers } from "../utils/Scalers";
import { hierarchicalClusteringUI } from "../utils/Clustering";

const Heatmap = ({
  marginConfig: { marginTop, marginBottom, marginLeft, marginRight },
  labelConfig: { labelFontSize, labelPadding },
  cellConfig: { cellPadding, cellHeight },
  data,
  rowLabels,
  colLabels,
}: HeatmapSettings) => {
  const dataScaler = useAppStore((state) => state.scaler);
  const clusteringMetric = useAppStore((state) => state.metric);
  const clusteringLinkage = useAppStore((state) => state.linkage);
  const svgRef = useAppStore((state) => state.svgRef);
  const svgWidth = useAppStore((state) => state.svgWidth);
  const svgHeight = useAppStore((state) => state.svgHeight);
  const [rowTextLength, setRowTextLength] = useState<number>(0);
  const [colTextLength, setColTextLength] = useState<number>(0);

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
  }, [svgRef]);

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

  const scaledData = DataScalers[dataScaler].function({
    data,
    ncols: colLabels.length,
    nrows: rowLabels.length,
  });

  const clustering = hierarchicalClusteringUI(
    Array.from({ length: rowLabels.length }, (_, rowIndex) =>
      scaledData.slice(
        rowIndex * colLabels.length,
        (rowIndex + 1) * colLabels.length
      )
    ),
    clusteringMetric,
    clusteringLinkage
  );

  const orderedRowLabels = Array.from(
    { length: rowLabels.length },
    (_, index) => rowLabels[index]
  );

  const orderedColLabels = Array.from(
    { length: colLabels.length },
    (_, index) => colLabels[index]
  );

  const clusteredData = clustering.flatMap((_, rowIndex) =>
    scaledData.slice(
      rowIndex * colLabels.length,
      (rowIndex + 1) * colLabels.length
    )
  );

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
        {data.map((value, index) => (
          <rect
            className="tooltip-trigger"
            key={index}
            x={xAxisScale(matrixIndices[index][1])}
            y={yAxisScale(matrixIndices[index][0])}
            width={Math.abs(xAxisScale(0) - xAxisScale(1)) - cellPadding}
            height={Math.abs(yAxisScale(0) - yAxisScale(1)) - cellPadding}
            fill={interpolateRdYlBu(scaledData[index])}
            strokeWidth={1}
            stroke="white"
            data-row-label={rowLabels[matrixIndices[index][0]]}
            data-col-label={colLabels[matrixIndices[index][1]]}
            data-cell-value={value}
            rx={1}
            ry={1}
          ></rect>
        ))}
      </g>
      <g id="row-labels">
        {rowLabels.map((value, index) => (
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
            {value}
          </text>
        ))}
      </g>
      <g id="col-labels">
        {colLabels.map((value, index) => (
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
            {value}
          </text>
        ))}
      </g>
      <HeatmapTooltip />
    </>
  );
};

export default Heatmap;
