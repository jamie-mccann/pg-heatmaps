import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

const Index = () => {
  return (
    <Grid flexDirection="column" alignItems="center">
      <Typography variant="h3">Welcome to ExHeatMap</Typography>
      <Typography variant="body1">
        This tool allows you to select a species and gene expression experiment
        as well as enter a list of genes to plot a heatmap of samples against
        their gene expression values for the entered genes.
      </Typography>
    </Grid>
  );
};

export default Index;
