import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

interface GeneListMakerProps {
  species: string | null;
  experiment: string | null;
  geneIds: string | null;
  setGeneIds: (genes: string) => void;
}

const GeneListMaker = ({
  species,
  experiment,
  geneIds,
  setGeneIds,
}: GeneListMakerProps) => {

  return (
    <Grid container spacing={2} padding={2} flexDirection="column">
      <Typography variant="h6">Gene List</Typography>
      <TextField
        variant="outlined"
        fullWidth
        multiline
        minRows={10}
        maxRows={10}
        disabled={!species || !experiment}
        value={geneIds}
        onChange={(event) => setGeneIds(event.target.value)}
      />
    </Grid>
  );
};

export default GeneListMaker;
