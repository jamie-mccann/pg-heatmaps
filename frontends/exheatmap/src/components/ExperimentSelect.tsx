import Grid from "@mui/material/Grid2";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";

// some interfaces and enums here
// ...
// ...

const experimentsBySpecies: { [key: string]: string[] } = {
  "Picea abies": [
    "Cold Stress Needles",
    "Cold Stress Roots",
    "Drought Stress Needles",
    "Drought Stress Roots",
    // these ones are not in the db yet
    // "Seasonal Needles",
    // "Seasonal Wood",
  ],
  "Pinus sylvestris": [
    "Cold Stress Needles",
    "Cold Stress Roots",
    "Drought Stress Needles",
    "Drought Stress Roots",
  ],
  "Populus tremula": [
    // "Light Response Test",
    // "Drought Resistance Study",
    // "Root Structure Analysis",
  ],
};

interface ExperimentSelectProps {
  species: string | null;
  experiment: string | null;
  setExperiment: (newExperiment: string | null) => void;
}

const ExperimentSelect = ({
  species,
  experiment,
  setExperiment,
}: ExperimentSelectProps) => {
  const handleExperimentSelect = (event: SelectChangeEvent) => {
    setExperiment(event.target.value);
  };

  // Get the available experiments based on the selected species
  const availableExperiments = species
    ? experimentsBySpecies[species] || []
    : [];

  return (
    <Grid container spacing={2} padding={2} flexDirection="column">
      <Typography variant="h6">Experiment Select</Typography>
      <FormControl fullWidth>
        <InputLabel id="experiment-select-label">Experiment</InputLabel>
        <Select
          labelId="experiment-select-label"
          id="experiment-select"
          value={experiment ?? ""}
          label="Experiment"
          onChange={handleExperimentSelect}
          variant="outlined"
          disabled={!species}
        >
          {/* map the experiments to MenuItems here */}
          {availableExperiments.length > 0 ? (
            availableExperiments.map((exp, index) => (
              <MenuItem key={index} value={exp}>
                {exp}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" disabled>
              No experiments available
            </MenuItem>
          )}
        </Select>
        <FormHelperText>Select a species to see experiments.</FormHelperText>
      </FormControl>
    </Grid>
  );
};

export default ExperimentSelect;
