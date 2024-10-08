import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";

const Root = () => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>For app bar</Grid>
      {/* Main Content and Sidebar */}
      <Grid container size={{ xs: 12 }} padding={2} spacing={2}>
        {/* Sidebar */}
        <Grid size={{ xs: 12, sm: 5, md: 4, lg: 3, xl: 2 }}>
          <Grid container flexDirection="column" spacing={2}>
            <Paper variant="outlined">Species Selection</Paper>
            <Paper variant="outlined">Experiment Selection</Paper>
            <Paper variant="outlined">Gene List</Paper>
          </Grid>
        </Grid>
        {/* Main Content */}
        <Grid size={{ xs: 12, sm: 7, md: 8, lg: 9, xl: 10 }}>Main</Grid>
      </Grid>
      {/* Footer */}
      <Grid size={{xs: 12}}>Footer</Grid>
    </Grid>
  );
};

export default Root;
