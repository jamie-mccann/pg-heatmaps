import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const Index = () => {
  return (
    <Paper>
      <Grid flexDirection="column" alignItems="center" padding={2} spacing={2}>
        <Typography variant="h3">ExHeatMap</Typography>
        <div><p></p></div>
        <Typography variant="body1">
          This tool allows you to select a species and gene expression
          experiment as well as enter a list of genes to plot a heatmap of
          samples against their gene expression values for the entered genes.
        </Typography>
        <div><p></p></div>
        <Typography variant="body1">
          The genes to be displayed are entered in the text field in the size
          bar under the heading "Gene List". It should be a line-delimited set
          of gene IDs (i.e. one line per ID). Once you've selected your species
          and experiment, this text field will become available to you. Once you
          have added your gene IDs, click the submit button to take you to the
          gene annotations and gene selection page.
        </Typography>
        <Typography variant="body1">
          On the gene annotations and selection page you can check the genes
          that you want to include in your heatmap. By default, all genes that
          have an annotation are selected. Genes with no annotation are
          disabled.
        </Typography>
        <Typography variant="body1">
          Once you have selected the genes you want to visualize, click the
          Heatmap button at the top of the page. This will take you to the
          heatmap page and generate an SVG heatmap plot of your selected genes'
          expression based on the species and experiment you chose.
        </Typography>
      </Grid>
    </Paper>
  );
};

export default Index;
