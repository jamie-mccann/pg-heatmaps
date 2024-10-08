import Grid from "@mui/material/Grid2";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";

enum SpeciesOptions {
  piceaabies = "Picea abies",
  pinussylvestris = "Pinus sylvestris",
  populustremula = "Populus tremula",
}

interface SpeciesSelectProps {
  species: string | null;
  setSpecies: (newSpecies: string | null) => void;
}

const SpeciesSelect = ({ species, setSpecies }: SpeciesSelectProps) => {
  const isSpeciesOption = (value: any): value is SpeciesOptions => {
    return Object.values(SpeciesOptions).includes(value);
  };

  const handleSpeciesSelect = (event: SelectChangeEvent) => {
    const selectedSpecies = event.target.value;

    if (isSpeciesOption(selectedSpecies)) {
      setSpecies(selectedSpecies);
    } else {
      setSpecies(null);
    }

    console.log(selectedSpecies)
  };

  return (
    <Grid container spacing={2} padding={2} flexDirection="column">
      <Typography variant="h6">Species Select</Typography>
      <FormControl fullWidth>
        <InputLabel id="species-select-label">Species</InputLabel>
        <Select
          labelId="species-select-label"
          id="species-select"
          value={species ?? ""}
          label="Species"
          onChange={handleSpeciesSelect}
          variant="outlined"
        >
          {Object.values(SpeciesOptions).map((value, index) => (<MenuItem key={index} value={value}>{value}</MenuItem>))}
        </Select>
        <FormHelperText>Select a species from the dropdown.</FormHelperText>
      </FormControl>
    </Grid>
  );
};

export default SpeciesSelect;
