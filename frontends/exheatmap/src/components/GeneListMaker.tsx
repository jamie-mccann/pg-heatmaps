import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.4)",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    // Firefox scrollbar styling
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(255, 255, 255, 0.2) rgba(0, 0, 0, 0.2)",
  },
}));

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
      {/* <TextField
        variant="outlined"
        fullWidth
        multiline
        minRows={10}
        maxRows={10}
        disabled={!species || !experiment}
        value={geneIds}
        onChange={(event) => setGeneIds(event.target.value)}
      /> */}
      <StyledTextField
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
