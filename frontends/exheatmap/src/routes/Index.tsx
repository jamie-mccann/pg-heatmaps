import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const Index = () => {
  return (
    <Paper>
      <Grid flexDirection="column" alignItems="center" padding={2} spacing={2}>
        <Typography variant="h3">Welcome to ExHeatMap</Typography>
        <Typography variant="body1">
          This tool allows you to select a species and gene expression
          experiment as well as enter a list of genes to plot a heatmap of
          samples against their gene expression values for the entered genes.
        </Typography>
      </Grid>
    </Paper>
  );
};

export default Index;
