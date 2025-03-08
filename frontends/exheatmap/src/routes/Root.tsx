import { useState } from "react";
import { ActionFunction, Form, Outlet, redirect } from "react-router-dom";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import ForestIcon from "@mui/icons-material/Forest";

import { useAppStore } from "../state/AppStore";
import {
  AnnotationsRequest,
  AnnotationsResponse,
  GeneAnnotation,
} from "../Models";

import ExperimentSelect from "../components/ExperimentSelect";
import GeneListMaker from "../components/GeneListMaker";
import SpeciesSelect from "../components/SpeciesSelect";
import { Typography } from "@mui/material";

export const geneIdsAction: ActionFunction = async ({ request }) => {
  const setGeneIds = useAppStore.getState().setGeneIds;
  const setGeneAnnotations = useAppStore.getState().setGeneAnnotations;
  const formData = await request.formData();

  if (
    !(
      formData.has("species") &&
      formData.has("experiment") &&
      formData.has("geneIds")
    )
  )
    throw new Error("species, experiment and a gene list must be specified!");

  if ((formData.get("geneIds") as string).trim() === "") {
    return redirect("/");
  }

  const geneIds = (formData.get("geneIds") as string)?.trim().split("\n");
  setGeneIds(geneIds);

  const requestBody: AnnotationsRequest = {
    species: formData.get("species") as string,
    geneIds: geneIds,
  };

  const url = import.meta.env.PROD
    ? "http://potter.srv.its.umu.se/api/annotations"
    : "http://localhost:8080/api/annotations";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Error fetching data from ${url}`);
  }

  const geneAnnotations: AnnotationsResponse = await response.json();

  setGeneAnnotations(geneAnnotations.results as GeneAnnotation[]);

  return redirect("/gene-list");
};

const Root = () => {
  const species = useAppStore((state) => state.species);
  const experiment = useAppStore((state) => state.experiment);
  const setSpecies = useAppStore((state) => state.setSpecies);
  const setExperiment = useAppStore((state) => state.setExperiment);
  const [geneIds, setGeneIds] = useState<string>("");

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <Paper
          sx={{
            backgroundColor: "#2E3135",
            padding: 2,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <ForestIcon fontSize="large" color="primary" />
            <Typography variant="h4">PlantGenie</Typography>
          </Grid>
        </Paper>
      </Grid>
      {/* Main Content and Sidebar */}
      <Grid container size={{ xs: 12 }} padding={2} spacing={2}>
        {/* Sidebar */}
        <Grid size={{ xs: 12, sm: 7, md: 5, lg: 4, xl: 3 }} spacing={2}>
          <Paper
            sx={{ backgroundColor: "#2E3135", padding: 2 }}
            variant="outlined"
          >
            <Grid container flexDirection="column" spacing={2}>
              <Paper>
                <SpeciesSelect species={species} setSpecies={setSpecies} />
              </Paper>
              <Paper>
                <ExperimentSelect
                  species={species}
                  experiment={experiment}
                  setExperiment={setExperiment}
                />
              </Paper>
              <Paper>
                <GeneListMaker
                  species={species}
                  experiment={experiment}
                  geneIds={geneIds}
                  setGeneIds={setGeneIds}
                />
                <Grid container flexDirection="column" padding={2} pt={0}>
                  <Form method="POST" action="/">
                    <input type="hidden" name="species" value={species ?? ""} />
                    <input
                      type="hidden"
                      name="experiment"
                      value={experiment ?? ""}
                    />
                    <input type="hidden" name="geneIds" value={geneIds} />

                    <Button
                      disabled={species === null || experiment === null}
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="secondary"
                    >
                      Submit
                    </Button>
                  </Form>
                </Grid>
              </Paper>
            </Grid>
          </Paper>
        </Grid>
        {/* Main Content */}
        <Grid size={{ xs: 12, sm: 5, md: 7, lg: 8, xl: 9 }}>
          <Paper
            sx={{ backgroundColor: "#2E3135", padding: 2 }}
            variant="outlined"
          >
            <Outlet />
          </Paper>
        </Grid>
      </Grid>
      {/* Footer */}
      {/* <Grid size={{ xs: 12 }}>Footer</Grid> */}
    </Grid>
  );
};

export default Root;
