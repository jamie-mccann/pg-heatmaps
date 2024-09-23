import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

import SpeciesCard from "../components/SpeciesCard";
import { useAppStore } from "../state/AppStore";
import speciesObjects from "../state/data/species";

const Root = () => {
  const species = useAppStore((state) => state.species);
  const setSpecies = useAppStore((state) => state.setSpecies);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // const goButton = document.querySelector("#species-submit-button");
    const handleClickOutside = (event: MouseEvent) => {
      if (
        species && // Check if a species is selected
        !document
          .querySelector(`#species-card-${species}`)
          ?.contains(event.target as Node) &&
        // allow clicking on submit button without reset
        !document.querySelector("#species-submit-button")?.contains(event.target as Node)
      ) {
        setSpecies(null); // Deselect species if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [species]);

  const handleCardSelect = (speciesId: string) => {
    if (speciesId === selectedCard) {
      setSelectedCard(null);
    } else {
      setSelectedCard(speciesId); // This ensures only one card can be selected at a time
    }
    setSpecies(speciesId);
  };

  const handlePlayButtonClick = (speciesId: string) => {
    setSpecies(speciesId);
    navigate(`/species/${speciesId}`);
  };

  const handleButtonClick = () => {
    navigate(`/${species}/file-upload`);
  };

  return (
    <Grid container padding={2} justifyContent="center">
      <Grid container flexDirection="column" spacing={0} alignItems="center">
        <Grid
          container
          flexDirection="column"
          spacing={1}
          alignItems="center"
          textAlign="center"
          width="100%"
          maxWidth={992}
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
        </Grid>
        <Grid
          container
          flexDirection="row"
          justifyContent="center"
          spacing={1}
          margin={1}
          maxWidth={992}
          borderRadius={5}
        >
          <Box
            width="100%"
            padding={2}
            sx={{ borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
          >
            <Typography
              variant="h4"
              sx={{
                textDecoration: "underline",
                textAlign: "center",
              }}
            >
              Core Species
            </Typography>
          </Box>
          {speciesObjects.map((value, index) => (
            <SpeciesCard
              key={index}
              {...value}
              isSelected={species === value.speciesId}
              onSelect={() => handleCardSelect(value.speciesId)}
              onPlay={() => handlePlayButtonClick(value.speciesId)}
            />
          ))}
          <Box
            minHeight={76}
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100%"
            sx={{ borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}
          >
            <Button
              id="species-submit-button"
              color="secondary"
              variant="contained"
              onClick={handleButtonClick}
              disabled={species !== null ? false : true}
              size="large"
            >
              Go
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Root;
