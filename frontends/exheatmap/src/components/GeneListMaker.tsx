import { useState } from "react";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

interface GeneListMakerProps {
  species: string | null;
  experiment: string | null;
  geneIds: string[];
  setGeneIds: (genes: string[]) => void;
}

const GeneListMaker = ({
  species,
  experiment,
  geneIds,
  setGeneIds,
}: GeneListMakerProps) => {
  const [text, setText] = useState<string>("");
  const [numLines, setNumLines] = useState<number>(0);

  const submitHandler = () => {
    console.log("submit clicked");
    const lines = text.trim().split("\n");
    console.log(`Number of lines = ${lines.length}`);
    console.log(lines.filter((value) => value !== ""));

    setGeneIds(lines.filter((value) => value !== ""));
    setNumLines(lines.length);
  };

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
        helperText={`Number of Genes: ${numLines}`}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <Button variant="contained" onClick={submitHandler}>
        Submit
      </Button>
      <FormControlLabel
        control={<Checkbox />}
        label="Save gene list for later"
      />
    </Grid>
  );
};

export default GeneListMaker;
