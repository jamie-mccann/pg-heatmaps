import { useState } from "react";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const GeneListMaker = ({
  species,
  experiment,
}: {
  species: string | null;
  experiment: string | null;
}) => {
  const [text, setText] = useState<string>("");
  const [numLines, setNumLines] = useState<number>(0);
  // check number of lines entered by user
  const verifyFormat = () => {};

  const submitHandler = () => {
    console.log("submit clicked")

  };
  return (
    <Grid container spacing={2} padding={2} flexDirection="column">
      <Typography variant="h6">Gene List</Typography>
      <TextField
        fullWidth
        variant="outlined"
        multiline
        minRows={10}
        maxRows={10}
        disabled={!species || !experiment}
        helperText={`No. Genes: ${numLines}`}
        // value={text}
      />
      <Button variant="contained" onClick={submitHandler}>Submit</Button>
      <FormControlLabel
        control={<Checkbox />}
        label="Save gene list for later"
      />
    </Grid>
  );
};

export default GeneListMaker;
