import { useEffect, useRef, useState } from "react";

import { useAppStore } from "../state/AppStore";

export interface HeatmapTooltipSettings {
  defaultWidth?: number;
  fontSize?: number;
  linePadding?: number;
  paddingLeft?: number;
  paddingRight?: number;
}

const HeatmapTooltip = ({
  defaultWidth = 100,
  fontSize = 12,
  linePadding = 8,
  paddingLeft = 8,
  paddingRight = 8,
}: HeatmapTooltipSettings) => {
  const svgRef = useAppStore((state) => state.svgRef);
  const svgHeight = useAppStore((state) => state.svgHeight);
  const svgWidth = useAppStore((state) => state.svgWidth);
  const tooltipRef = useRef<SVGGElement>(null);
  const [visibility, setVisibility] = useState<"hidden" | "visible">("hidden");
  const [transform, setTransform] = useState<string | undefined>(undefined);
  const [tooltipWidth, setTooltipWidth] = useState(defaultWidth);

  const tooltipHeight = 4 * linePadding + 3 * fontSize;

  useEffect(() => {
    if (svgRef === null || svgRef.current === null) return;
    if (tooltipRef.current === null) return;

    const svg = svgRef.current;
    const svgCtm = svg.getScreenCTM();

    const showTooltip = (event: MouseEvent) => {
      event.preventDefault();
      if (tooltipRef.current === null) return;

      // think this should always exist if svgRef.current !== null
      const CTM = svgCtm!;

      // data-row-label, data-col-label, data-cell-value
      const tooltipRow =
        tooltipRef.current.querySelector<SVGTextElement>("#tooltip-row");

      if (tooltipRow !== null) {
        tooltipRow.textContent =
          "row: " +
          (event.target as SVGRectElement).getAttributeNS(
            null,
            "data-row-label"
          );
      }

      const tooltipRowWidth = tooltipRow
        ? tooltipRow.getComputedTextLength()
        : -Infinity;

      const tooltipCol =
        tooltipRef.current.querySelector<SVGTextElement>("#tooltip-col");

      if (tooltipCol !== null) {
        tooltipCol.textContent =
          "col: " +
          (event.target as SVGRectElement).getAttributeNS(
            null,
            "data-col-label"
          );
      }

      const tooltipColWidth = tooltipCol
        ? tooltipCol.getComputedTextLength()
        : -Infinity;

      const tooltipCell =
        tooltipRef.current.querySelector<SVGTextElement>("#tooltip-cell");

      if (tooltipCell !== null) {
        const value = parseFloat(
          (event.target as SVGRectElement).getAttributeNS(
            null,
            "data-cell-value"
          ) || "0"
        );
        tooltipCell.textContent = "value: " + value.toFixed(3);
      }

      const tooltipCellWidth = tooltipCell
        ? tooltipCell.getComputedTextLength()
        : -Infinity;

      const calculatedTooltipWidth =
        Math.max(
          tooltipCellWidth,
          tooltipColWidth,
          tooltipRowWidth,
          defaultWidth
        ) +
        paddingLeft +
        paddingRight;

      let x = (event.pageX - CTM.e + 6) / CTM.a;
      let y = (event.pageY - CTM.f + 20) / CTM.d;

      // Check if tooltip would overflow the SVG width and adjust x position
      if (x + calculatedTooltipWidth + paddingLeft + paddingRight > svgWidth) {
        x -= calculatedTooltipWidth + 12; // Shift left if near right edge
      }
      // Check if tooltip would overflow the SVG height and adjust y position
      if (y + tooltipHeight > svgHeight) {
        y -= tooltipHeight + 24; // Shift up if near bottom edge
      }

      setTooltipWidth(calculatedTooltipWidth);
      setTransform(`translate(${x} ${y})`);
      setVisibility("visible");
    };

    const hideTooltip = (event: MouseEvent) => {
      event.preventDefault();
      setVisibility("hidden");
    };

    Array.from(svg.getElementsByClassName("tooltip-trigger")).forEach(
      (value) => {
        (value as SVGRectElement).addEventListener("mouseenter", showTooltip);
        (value as SVGRectElement).addEventListener("mouseleave", hideTooltip);
      }
    );

    return () => {
      Array.from(svg.getElementsByClassName("tooltip-trigger")).forEach(
        (value) => {
          (value as SVGRectElement).removeEventListener(
            "mouseenter",
            showTooltip
          );
          (value as SVGRectElement).removeEventListener(
            "mouseleave",
            hideTooltip
          );
        }
      );
    };
  }, [svgRef, tooltipRef]);

  return (
    <g ref={tooltipRef} id="tooltip" visibility={visibility} transform={transform}>
      {/* drop shadow */}
      <rect
        x={2}
        y={2}
        width={tooltipWidth}
        height={tooltipHeight}
        fill="black"
        opacity={0.4}
        rx={2}
        ry={2}
      ></rect>
      {/* text container with white background */}
      <rect
        x={0}
        y={0}
        width={tooltipWidth}
        height={tooltipHeight}
        fill="white"
        rx={2}
        ry={2}
      ></rect>
      <text
        id="tooltip-row"
        fontFamily="Roboto"
        fontWeight="normal"
        fontSize={fontSize}
        dominantBaseline="hanging"
        x={paddingLeft}
        y={linePadding}
      >
        tooltip row label
      </text>
      <text
        id="tooltip-col"
        fontFamily="Roboto"
        fontWeight="normal"
        fontSize={fontSize}
        dominantBaseline="hanging"
        x={paddingLeft}
        y={fontSize + 2 * linePadding}
      >
        tooltip column label
      </text>
      <text
        id="tooltip-cell"
        fontFamily="Roboto"
        fontWeight="normal"
        fontSize={fontSize}
        dominantBaseline="hanging"
        x={paddingLeft}
        y={2 * fontSize + 3 * linePadding}
      >
        tooltip cell value
      </text>
    </g>
  );
};

export default HeatmapTooltip;
