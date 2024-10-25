import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// import { range } from "d3";
// import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";

import { useAppStore } from "../state/AppStore";
import {
  ExperimentTitleToId,
  ExpressionRequest,
  ExpressionResponse,
} from "../Models";

import { useHeatMapRectangles, useMaxTextLengths } from "../hooks/useHeatmap";

const Heatmap = () => {
  const svgRef = useAppStore((state) => state.svgRef);
  const svgWidth = useAppStore((state) => state.width);
  const svgHeight = useAppStore((state) => state.height);
  const geneAnnotations = useAppStore((state) => state.geneAnnotations);
  const species = useAppStore((state) => state.species);
  const experiment = useAppStore((state) => state.experiment);

  const heatMapSettings = {
    svgHeight: svgHeight,
    svgWidth: svgWidth,
    marginTop: 30,
    marginRight: 30,
    marginBottom: 30,
    marginLeft: 30,
    labelFontSize: 10,
    labelPadding: 10,
    cellPadding: 1,
  };

  const [expressionData, setExpressionData] =
    useState<ExpressionResponse | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // we want to redirect to the "/" route if the user refreshes the page
    if (geneAnnotations.length === 0) navigate("/");

    if (species === null) navigate("/");

    const requestBody: ExpressionRequest = {
      species: species!, // species has to be set here, no?
      clustering: "none",
      experimentId: ExperimentTitleToId[`${species} ${experiment}`],
      geneIds: geneAnnotations.map(
        (value) => `${value.chromosomeId}_${value.geneId}`
      ),
    };

    const fetchData = async () => {
      const url = "http://localhost:8080/api/expression";

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw {
            name: "DataFetchException",
            message: `Unable to fetch data from ${url}`,
          } as Error;
        }

        const result: ExpressionResponse = await response.json();
        setExpressionData(result);
      } catch (error) {
        console.log(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      } finally {
        console.log("Done loading the page data");
      }
    };
    fetchData();
  }, [geneAnnotations]);

  const { rowTextLength, colTextLength } = useMaxTextLengths({
    svgReference: svgRef,
    rowLabels: expressionData
      ? expressionData.genes.map(
          (value) => `${value.chromosomeId}_${value.geneId}`
        )
      : [],
    colLabels: expressionData
      ? expressionData.samples.map(
          (value) => `${value.experiment}_${value.sampleId}`
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
    svgReference: svgRef,
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
  return <></>
};

export default Heatmap;
