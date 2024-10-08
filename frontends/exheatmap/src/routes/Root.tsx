import { useState } from "react";

import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";

import ExperimentSelect from "../components/ExperimentSelect";
import GeneListMaker from "../components/GeneListMaker";
import SpeciesSelect from "../components/SpeciesSelect";

const Root = () => {
  const [species, setSpecies] = useState<string | null>(null);
  const [experiment, setExperiment] = useState<string | null>(null);

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>For app bar</Grid>
      {/* Main Content and Sidebar */}
      <Grid container size={{ xs: 12 }} padding={2} spacing={2}>
        {/* Sidebar */}
        <Grid
          size={{ xs: 12, sm: 5, md: 4, lg: 3, xl: 2 }}
          // sx={{ backgroundColor: "grey" }}
          // padding={2}
          >
          <Paper sx={{ backgroundColor: "lightgrey", padding: 2}} variant="outlined">
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
              <GeneListMaker species={species} experiment={experiment} />
            </Paper>
          </Grid>
          </Paper>
        </Grid>
        {/* Main Content */}
        <Grid size={{ xs: 12, sm: 7, md: 8, lg: 9, xl: 10 }}>
          <Paper>Main</Paper>
        </Grid>
      </Grid>
      {/* Footer */}
      <Grid size={{ xs: 12 }}>Footer</Grid>
    </Grid>
  );
};

export default Root;
