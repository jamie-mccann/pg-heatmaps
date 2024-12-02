import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const Index = () => {
  return (
    <Paper>
      <Grid flexDirection="column" alignItems="center" padding={4} spacing={2}>
        {/* Title */}
        <Typography
          variant="h3"
          component="h3"
          gutterBottom
          sx={{ textDecoration: "underline" }}
        >
          Welcome to Plantgenie's ExHeatMap
        </Typography>

        {/* Introduction */}
        <Typography variant="body1" component="p" gutterBottom>
          This tool allows you to select a species and gene expression
          experiment as well as enter a list of genes to plot a heatmap of
          samples with their gene expression values for the entered genes.
        </Typography>

        {/* Gene List Instructions */}
        <Typography variant="h6" component="h6" gutterBottom>
          How to Enter Genes
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
          First, select <strong>both</strong> a <u>species</u> and{" "}
          <u>experiment</u> from the dropdown menus. The genes to be displayed
          are entered in the text field in the side bar under the heading{" "}
          <strong>"Gene List"</strong>. It should be a line-delimited set of
          gene IDs (i.e., one line per ID). Once you've selected your species
          and experiment, this text field will become available to you. Once you
          have added your gene IDs, click the submit button to take you to the
          gene annotations and selection page.
        </Typography>

        {/* Gene Selection Instructions */}
        <Typography variant="h6" component="h6" gutterBottom>
          Gene Annotations and Selection
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
          On the gene annotations and selection page, you are presented with a
          scrollable table (hover over the table and scroll up and down with the
          mouse) where you can check the genes that you want to include in your
          heatmap. By default, all genes that have an annotation are selected.
          Genes with no annotation are disabled.
        </Typography>

        {/* Heatmap Generation Instructions */}
        <Typography variant="h6" component="h6" gutterBottom>
          Generating the Heatmap
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
          Once you have selected the genes you want to visualize, click the{" "}
          <strong>Heatmap</strong> button at the top of the page. This will take
          you to the heatmap page and generate an SVG heatmap plot of your
          selected genes' expression based on the species and experiment you
          chose.
        </Typography>

        {/* Heatmap Modification Instructions */}
        <Typography variant="h6" component="h6" gutterBottom>
          Scaling and Clustering the Heatmap
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
          There are various options for applying scaling and clustering to your
          selected datasets. The <strong>default</strong> applies clustering on
          the gene ids (i.e. by row) and base 2 log scaling (with a plus 1 to
          avoid log(0) errors). You can change these options by clicking the
          radio button options above the heatmap and the heatmap should change
          accordingly. The raw unscaled values (in TPM) can be viewed by
          hovering over a rectangle in the heatmap. A tooltip is shown on hover
          which provides information about the gene id, sample id and gene
          expression value for the experiment.
        </Typography>
      </Grid>
    </Paper>
  );
};

export default Index;
