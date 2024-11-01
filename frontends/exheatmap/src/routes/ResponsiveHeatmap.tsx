import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Paper, Typography } from "@mui/material";

import { useAppStore } from "../state/AppStore";
import {
  ExperimentTitleToId,
  ExpressionRequest,
  ExpressionResponse,
  HeatmapSettings,
} from "../Models";

import SvgCanvas from "../components/SvgCanvas";
import Heatmap from "../components/Heatmap";

const ResponsiveHeatmap = () => {
  const species = useAppStore((state) => state.species);
  const experiment = useAppStore((state) => state.experiment);
  const geneAnnotations = useAppStore((state) => state.geneAnnotations);
  const selectedGenes = useAppStore((state) => state.selectedGenes);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

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
      geneIds: geneAnnotations
        .filter((_, index) => selectedGenes[index])
        .map((value) => `${value.chromosomeId}_${value.geneId}`),
    };

    const fetchData = async () => {
      // const url = "http://192.168.0.109:8080/api/expression";
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

        setLoadingError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      } finally {
        console.log("Done loading the page data");
        setIsLoading(false);
      }
    };
    fetchData();
  }, [geneAnnotations]);

  if (isLoading) {
    return <Typography variant="h3">Fetching data ...</Typography>;
  }

  if (loadingError !== null) {
    return (
      <Typography variant="h3">An error occurred: {loadingError}</Typography>
    );
  }

  const heatMapSettings: HeatmapSettings = {
    marginConfig: {
      marginTop: 30,
      marginRight: 30,
      marginBottom: 30,
      marginLeft: 30,
    },
    labelConfig: {
      labelFontSize: 10,
      labelPadding: 10,
    },
    cellConfig: {
      cellPadding: 1,
    },
    data: expressionData!.values,
    rowLabels: expressionData!.genes.map(
      (value) => `${value.chromosomeId}_${value.geneId}`
    ),
    colLabels: expressionData!.samples.map(
      (value) => `${value.reference} ${value.condition}`
    ),
  };

  return (
    <Paper
      id="svg-container-2"
      className="svg-container"
      sx={{
        height: "800px",
        width: "100%",
      }}
    >
      <SvgCanvas>
        <Heatmap
          marginConfig={heatMapSettings.marginConfig}
          labelConfig={heatMapSettings.labelConfig}
          cellConfig={heatMapSettings.cellConfig}
          data={heatMapSettings.data}
          rowLabels={heatMapSettings.rowLabels}
          colLabels={heatMapSettings.colLabels}
        />
      </SvgCanvas>
    </Paper>
  );
};

export default ResponsiveHeatmap;
