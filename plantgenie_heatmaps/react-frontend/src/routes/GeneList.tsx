import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

import { useAppStore } from "../state/AppStore";

const GeneList = () => {
  const species = useAppStore((state) => state.species);
  const file = useAppStore((state) => state.file);

  return (
    <Grid container flexDirection="column" justifyContent="center">
      <Typography variant="h3">{`Species: ${species}`}</Typography>
      <Typography variant="body1">
        {file ? file.name : "No file found!"}
      </Typography>
    </Grid>
  );
};

export default GeneList;
