import { useEffect, useMemo, useRef, useState } from "react";

import { range } from "d3";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";

import {
  useHeatMapRectangles,
  useMaxTextLengths,
} from "../hooks/useHeatmap.ts";
import { useAppStore } from "../state/AppStore.ts";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";

interface ExpressionGene {
  chromosome_id: string;
  gene_id: string;
}

interface ExpressionSample {
  experiment_id: string;
  replicate_id: number;
  stub: string;
  experiment_description: string;
}

interface ExpressionResults {
  genes: ExpressionGene[];
  samples: ExpressionSample[];
  values: number[];
}

interface HeatMapProps {
  svgWidth: number;
  svgHeight: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  labelFontSize: number;
  labelPadding: number;
  cellPadding: number;
}

const Heatmap = () => {
  const navigate = useNavigate();
  const [expressionData, setExpressionData] =
    useState<ExpressionResults | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const geneAnnotations = useAppStore((state) => state.geneAnnotations);

  const heatMapSettings: HeatMapProps = {
    svgHeight: 2500,
    svgWidth: 960,
    marginTop: 30,
    marginRight: 30,
    marginBottom: 30,
    marginLeft: 30,
    labelFontSize: 10,
    labelPadding: 10,
    cellPadding: 1,
  };

  const heatmapSvgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // we want to redirect to the "/" route if the user refreshes the page
    if (geneAnnotations.length === 0) navigate("/");
    const fetchData = async () => {
      const url = "http://localhost:8080/api/expression_data";

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            species: "Picea abies", // TODO: set in zustand app store
            experiment: "blahdy blah blah", // TODO: set in zustand app store
            gene_ids: geneAnnotations.map(
              (value) => `${value.chromosome_id}_${value.gene_id}`
            ),
          }),
        });

        if (!response.ok) {
          throw {
            name: "DataFetchException",
            message: `Unable to fetch data from ${url}`,
          } as Error;
        }

        const result: ExpressionResults = await response.json();
        setExpressionData(result);
        console.log(result);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    console.log(loading);
    console.log(error);
  }, [geneAnnotations]);

  const { rowTextLength, colTextLength } = useMaxTextLengths({
    svgReference: heatmapSvgRef,
    rowLabels: expressionData
      ? expressionData.genes.map(
          (value) => `${value.chromosome_id}_${value.gene_id}`
        )
      : [],
    colLabels: expressionData
      ? expressionData.samples.map(
          (value) => `${value.experiment_id}_${value.stub}`
        )
      : [],
    labelFontSize: heatMapSettings.labelFontSize,
  });

  const rowScale = useMemo(
    () =>
      rowTextLength === null || rowTextLength < 0 || expressionData === null
        ? undefined
        : scaleLinear()
            .domain([0, expressionData.samples.length])
            .range([
              heatMapSettings.marginLeft,
              heatMapSettings.svgWidth -
                heatMapSettings.marginRight -
                rowTextLength -
                heatMapSettings.labelPadding,
            ]),
    [rowTextLength, expressionData]
  );

  const colScale = useMemo(
    () =>
      colTextLength === null || colTextLength < 0 || expressionData === null
        ? undefined
        : scaleLinear()
            .domain([0, expressionData.genes.length])
            .range([
              heatMapSettings.marginTop +
                colTextLength * Math.sin(Math.PI / 4) +
                heatMapSettings.labelPadding,
              heatMapSettings.svgHeight - heatMapSettings.marginBottom,
            ]),
    [colTextLength, expressionData]
  );

  useHeatMapRectangles({
    svgReference: heatmapSvgRef,
    numberOfRows:
      expressionData !== null ? expressionData.genes.length : -Infinity,
    numberOfCols:
      expressionData !== null ? expressionData.samples.length : -Infinity,
    cellValues: expressionData !== null ? expressionData.values : [],
    cellValueScaleFunction: (value) => Math.log2(1 + value),
    xScaler: rowScale,
    yScaler: colScale,
    cellPadding: heatMapSettings.cellPadding,
  });

  useEffect(() => {
    if (heatmapSvgRef.current === null || expressionData === null) return;
    if (rowTextLength === null || colTextLength === null) return;
    if (rowScale === undefined || colScale === undefined) return;

    const svg = select(heatmapSvgRef.current);

    const geneLabelsGroup = svg.append("g").attr("class", "gene-labels-group");

    const genesData = range(expressionData.genes.length).map((value) => ({
      ...expressionData.genes[value],
      index: value,
    }));

    geneLabelsGroup
      .selectAll("text")
      .data(genesData)
      .join("text")
      .attr(
        "transform",
        (d) =>
          `translate(${
            heatMapSettings.svgWidth -
            heatMapSettings.marginRight -
            rowTextLength
          }, ${(colScale(d.index) + colScale(d.index + 1)) / 2})`
      )
      .attr("font-size", heatMapSettings.labelFontSize)
      .attr("font-family", "monospace")
      .attr("fill", "grey")
      .attr("font-weight", "normal")
      .attr("text-anchor", "left")
      .attr("dominant-baseline", "middle")
      .text((d) => `${d.chromosome_id}_${d.gene_id}`)
      .on("mouseenter", function () {
        select(this).transition().duration(300).attr("font-weight", "bold");
      })
      .on("mouseleave", function () {
        select(this).transition().duration(300).attr("font-weight", "normal");
      });

    const sampleLabelsGroup = svg
      .append("g")
      .attr("class", "sample-labels-group");

    const samplesData = range(expressionData.samples.length).map((value) => ({
      ...expressionData.samples[value],
      index: value,
    }));

    sampleLabelsGroup
      .selectAll("text")
      .data(samplesData)
      .join("text")
      .attr(
        "transform",
        (d) =>
          `translate(${(rowScale(d.index) + rowScale(d.index + 1)) / 2},${
            heatMapSettings.marginTop + colTextLength * Math.sin(Math.PI / 4)
          }) rotate(-45)`
      )
      .attr("font-size", heatMapSettings.labelFontSize)
      .attr("font-family", "monospace")
      .attr("font-weight", "normal")
      .attr("fill", "white")
      .attr("text-anchor", "left")
      .attr("dominant-baseline", "middle")
      .text((d) => `${d.experiment_id}_${d.stub}`)
      .on("mouseenter", function () {
        select(this).transition().duration(300).attr("font-weight", "bold");
      })
      .on("mouseleave", function () {
        select(this).transition().duration(300).attr("font-weight", "normal");
      })
      .append("title")
      .text((d) => `${d.experiment_description}`);
  }, [heatmapSvgRef, expressionData, rowTextLength, colTextLength]);

  return (
    <Paper
      id="svg-container-2"
      className="svg-container"
      sx={{
        height: heatMapSettings.svgHeight,
        width: heatMapSettings.svgWidth,
      }}
    >
      <svg
        id="svg-canvas-2"
        className="svg-canvas"
        ref={heatmapSvgRef}
        style={{ height: "100%", width: "100%" }}
      ></svg>
    </Paper>
  );
};

export default Heatmap;
