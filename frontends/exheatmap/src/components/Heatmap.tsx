import { useEffect, useLayoutEffect, useMemo, useState } from "react";

import { interpolateRdYlBu, range } from "d3";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";

import { useAppStore } from "../state/AppStore";
import { HeatmapSettings } from "../Models";

const Heatmap = ({
  marginConfig: { marginTop, marginBottom, marginLeft, marginRight },
  labelConfig: { labelFontSize, labelPadding },
  cellConfig: { cellPadding },
  data,
  rowLabels,
  colLabels,
}: HeatmapSettings) => {
  const svgRef = useAppStore((state) => state.svgRef);
  const svgWidth = useAppStore((state) => state.width);
  const svgHeight = useAppStore((state) => state.height);
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

  useEffect(() => {
    if (svgRef === null || svgRef.current === null) return;

    const svg = svgRef.current;

    const svgCtm = svg.getScreenCTM();

    const tooltip = document.getElementById("tooltip");

    const showTooltip = (event: MouseEvent) => {
      event.preventDefault();
      if (svgCtm === null) return;
      if (tooltip === null) return;

      const mouseX = (event.pageX - svgCtm.e) / svgCtm.a;
      const mouseY = (event.pageY - svgCtm.f) / svgCtm.d;

      tooltip.setAttributeNS(null, "x", (mouseX + 6 / svgCtm.a).toString());
      tooltip.setAttributeNS(null, "y", (mouseY + 20 / svgCtm.d).toString());
      tooltip.setAttributeNS(null, "visibility", "visible");

      Array.from(tooltip.children).forEach((value) =>
        tooltip.removeChild(value)
      );

      if (event.target) {
        const tooltipText = (event.target as SVGRectElement).getAttributeNS(
          null,
          "data-tooltip-text"
        );

        tooltipText !== null &&
          tooltipText.split("\n").forEach((value, index) => {
            const tspan = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "tspan"
            );
            tspan.setAttribute("x", (mouseX + 6 / svgCtm.a).toString());
            tspan.setAttribute("dy", index === 0 ? "0" : "1.2em");
            tspan.textContent = value;
            tooltip.appendChild(tspan);
          });
      }
    };

    const hideTooltip = (event: MouseEvent) => {
      event.preventDefault();
      tooltip?.setAttributeNS(null, "visibility", "hidden");
    };

    const triggers = document.getElementsByClassName("tooltip-trigger");

    Array.from(triggers).map((value) => {
      (value as SVGRectElement).addEventListener("mouseenter", showTooltip);
      (value as SVGRectElement).addEventListener("mouseleave", hideTooltip);
    });
  }, [svgRef]);

  const xAxisScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, colLabels.length])
        .range([
          marginLeft,
          svgWidth - marginRight - rowTextLength - labelPadding,
        ]),
    [svgWidth, rowTextLength]
  );

  const yAxisScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, rowLabels.length])
        .range([
          marginTop + colTextLength * Math.sin(Math.PI / 4) + labelPadding,
          svgHeight - marginBottom,
        ]),
    [svgHeight, colTextLength]
  );

  const matrixIndices = useMemo(
    () =>
      range(rowLabels.length).flatMap((row) =>
        range(colLabels.length).map((col) => [row, col])
      ),
    [rowLabels, colLabels]
  );

  return (
    <>
      <g id="rectangles">
        {data.map((value, index) => (
          <rect
            className="tooltip-trigger"
            key={index}
            x={xAxisScale(matrixIndices[index][1])}
            y={yAxisScale(matrixIndices[index][0])}
            width={Math.abs(xAxisScale(0) - xAxisScale(1)) - cellPadding}
            height={Math.abs(yAxisScale(0) - yAxisScale(1)) - cellPadding}
            fill={interpolateRdYlBu(value)}
            strokeWidth={1}
            stroke="white"
            data-tooltip-text={`row: ${
              rowLabels[matrixIndices[index][1]]
            }\ncol: ${colLabels[matrixIndices[index][0]]}\nvalue: ${value}`}
          >
            <title>{value}</title>
          </rect>
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
            fontFamily="Roboto,monospace"
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
            fontFamily="Roboto,monospace"
            textAnchor="left"
            dominantBaseline="middle"
            fontWeight="normal"
            fill="lightgrey"
          >
            {value}
          </text>
        ))}
      </g>
      {/* <g id="tooltip" visibility="hidden">
        <rect
          x={2}
          y={2}
          width={80}
          height={24}
          fill="black"
          opacity={0.4}
          rx={2}
          ry={2}
        />
        <rect width={80} height={24} fill="white" opacity={0.4} rx={2} ry={2} />
        <text id="tooltip-text" x={4} y={6}>
          tooltip
        </text>
      </g> */}
      <text
        id="tooltip"
        visibility="hidden"
        // dominantBaseline="hanging"
        overflow="visible"
        fill="white"
        fontSize={labelFontSize}
        fontFamily="Roboto"
      ></text>
    </>
  );
};

export default Heatmap;
