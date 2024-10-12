import { useState } from "react";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";

import ExperimentSelect from "../components/ExperimentSelect";
import GeneListMaker from "../components/GeneListMaker";
import SpeciesSelect from "../components/SpeciesSelect";
// import GeneTable, { GeneAnnotation } from "../components/GeneTable";
import { Form, Outlet, redirect } from "react-router-dom";

import { ActionFunction } from "react-router-dom";

import { useAppStore } from "../state/AppStore";
import { GeneAnnotation } from "../state/SliceTypes";

interface GeneAnnotationRequestBody {
  species?: string;
  experiment?: string;
  gene_ids: string[];
}

interface GeneAnnotationResponse {
  chromosome_id: string;
  gene_id: string;
  genus: string;
  species: string;
  tool: string;
  annotation: string;
  evalue: number;
  score: number;
}

interface GeneAnnotationResponseBody {
  results: GeneAnnotationResponse[];
}

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

  const geneIds = (formData.get("geneIds") as string)?.trim().split("\n");
  setGeneIds(geneIds);

  const requestBody: GeneAnnotationRequestBody = {
    species: formData.get("species") as string,
    experiment: formData.get("experiment") as string,
    gene_ids: geneIds,
  };

  const url = "http://localhost:8080/api/genes";

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

  const geneAnnotations = (await response.json()) as GeneAnnotationResponseBody;

  setGeneAnnotations(geneAnnotations.results as GeneAnnotation[]);

  return redirect("/gene-list");
};

const Root = () => {
  const [species, setSpecies] = useState<string | null>(null);
  const [experiment, setExperiment] = useState<string | null>(null);
  const [geneIds, setGeneIds] = useState<string>("");
  // const [geneIds, setGeneIds] = useState<string[]>([]);
  // const [geneAnnotations, setGeneAnnotations] = useState<GeneAnnotation[]>([]);

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>For app bar</Grid>
      {/* Main Content and Sidebar */}
      <Grid container size={{ xs: 12 }} padding={2} spacing={2}>
        {/* Sidebar */}
        <Grid size={{ xs: 12, sm: 7, md: 5, lg: 4, xl: 3 }} spacing={2}>
          <Paper
            sx={{ backgroundColor: "darkgrey", padding: 2 }}
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
            sx={{ backgroundColor: "darkgrey", padding: 2 }}
            variant="outlined"
          >
            <Outlet />
          </Paper>

          {/* <Paper
            sx={{ backgroundColor: "lightgrey", padding: 2 }}
            variant="outlined"
          >
            <Grid container flexDirection="column" spacing={2}>
              <Paper>
                <GeneTable
                  geneIds={geneIds}
                  geneAnnotations={geneAnnotations}
                  setGeneAnnotations={setGeneAnnotations}
                />
              </Paper>
            </Grid>
          </Paper> */}
        </Grid>
      </Grid>
      {/* Footer */}
      <Grid size={{ xs: 12 }}>Footer</Grid>
    </Grid>
  );
};

export default Root;
