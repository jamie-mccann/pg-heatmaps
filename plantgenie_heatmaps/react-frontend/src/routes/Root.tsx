import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

import SpeciesCard from "../components/SpeciesCard";
import { useAppStore } from "../state/AppStore";
import speciesObjects from "../state/data/species";

const Root = () => {
  const setSpecies = useAppStore((state) => state.setSpecies);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleCardSelect = (speciesName: string) => {
    setSelectedCard(speciesName); // This ensures only one card can be selected at a time
  };

  const handlePlayButtonClick = (speciesId: string) => {
    setSpecies(speciesId);
    navigate(`/species/${speciesId}`);
  };
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/file-upload");
  };

  return (
    <Grid container padding={2} justifyContent="center">
      <Grid container flexDirection="column" spacing={2}>
        <Grid
          container
          flexDirection="column"
          spacing={1}
          alignItems="center"
          textAlign="center"
        >
          <Typography
            variant="h3"
            textAlign="center"
            color="secondary"
            sx={{ textDecoration: "underline" }}
          >
            PlantGenIE
          </Typography>
          <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
            Please select a species by clicking on one of the species' cards
            below!
          </Typography>
          <Typography variant="caption">
            Click on the corresponding play button and you will then be routed
            to a page to upload a list of genes to get expression data.
          </Typography>
          <Typography variant="h4" sx={{ textDecoration: "underline" }}>
            Core Species
          </Typography>
        </Grid>
        <Grid
          container
          flexDirection="row"
          justifyContent="center"
          spacing={2}
          maxWidth={1000}
        >
          {speciesObjects.map((value, index) => (
            <SpeciesCard
              key={index}
              {...value}
              isSelected={selectedCard === value.speciesName}
              onSelect={() => handleCardSelect(value.speciesName)}
              onPlay={() => handlePlayButtonClick(value.speciesId)}
            />
          ))}
        </Grid>
        <Button
          color="secondary"
          variant="contained"
          onClick={handleButtonClick}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

export default Root;
