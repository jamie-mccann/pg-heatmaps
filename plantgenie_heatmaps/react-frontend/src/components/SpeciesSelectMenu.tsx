import { useState } from "react";
import { useNavigation } from "react-router-dom";

// material ui imports
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

// internal imports
import { useAppStore } from "../state/AppStore";

const AVAILABLE_SPECIES: string[] = ["Picea abies"];

const SpeciesSelectMenu = () => {
  const navigate = useNavigation();
  const species = useAppStore((state) => state.species);
  const setSpecies = useAppStore((state) => state.setSpecies);

  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorElement);

  const handleMenuButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setAnchorElement(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElement(null);
  };

  const handleMenuItemClick = (species: string) => {
    return () => {
      setSpecies(species);
      handleMenuClose();
    };
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Button
        variant="outlined"
        size="large"
        id="species-select-menu-btn"
        onClick={handleMenuButtonClick}
        endIcon={<ArrowDropDownIcon />}
        color={species != null ? "secondary" : "primary"}
        sx={{ minWidth: 300 }}
        disableRipple
      >
        {species != null ? species : "Select species"}
      </Button>
      <Typography variant="caption" color="secondary">
        {species != null
          ? `Selected: ${species}`
          : "Click dropdown to select species"}
      </Typography>
      <Menu
        id="species-select-menu"
        anchorEl={anchorElement}
        open={open}
        onClose={handleMenuClose}
      >
        {AVAILABLE_SPECIES.map((value, index) => (
          <MenuItem
            key={index}
            onClick={handleMenuItemClick(value)}
            sx={{ minWidth: 300, justifyContent: "center" }}
          >
            {value}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default SpeciesSelectMenu;
