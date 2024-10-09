import { useState } from "react";

import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";

import ExperimentSelect from "../components/ExperimentSelect";
import GeneListMaker from "../components/GeneListMaker";
import SpeciesSelect from "../components/SpeciesSelect";
import GeneTable, { GeneAnnotation } from "../components/GeneTable";

const Root = () => {
  const [species, setSpecies] = useState<string | null>(null);
  const [experiment, setExperiment] = useState<string | null>(null);
  const [geneIds, setGeneIds] = useState<string[]>([]);
  const [geneAnnotations, setGeneAnnotations] = useState<GeneAnnotation[]>([]);

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>For app bar</Grid>
      {/* Main Content and Sidebar */}
      <Grid container size={{ xs: 12 }} padding={2} spacing={2}>
        {/* Sidebar */}
        <Grid
          size={{ xs: 12, sm: 7, md: 5, lg: 4, xl: 3 }}
          // sx={{ backgroundColor: "grey" }}
          // padding={2}
        >
          <Paper
            sx={{ backgroundColor: "lightgrey", padding: 2 }}
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
              </Paper>
            </Grid>
          </Paper>
        </Grid>
        {/* Main Content */}
        <Grid size={{ xs: 12, sm: 5, md: 7, lg: 8, xl: 9 }}>
          <Paper>
            <GeneTable
              geneIds={geneIds}
              geneAnnotations={geneAnnotations}
              setGeneAnnotations={setGeneAnnotations}
            />
          </Paper>
        </Grid>
      </Grid>
      {/* Footer */}
      <Grid size={{ xs: 12 }}>Footer</Grid>
    </Grid>
  );
};

export default Root;
