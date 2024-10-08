import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { SpeciesCardProps } from "./SpeciesCard.tsx";

const SpeciesCardNoButton = ({
  speciesName,
  speciesDescription,
  commonName,
  imgLocation,
  isSelected,
  onSelect,
}: SpeciesCardProps) => {
  const theme = useTheme(); // Access the theme

  return (
    <Card
      sx={{
        width: 320,
        display: "flex",
        flexDirection: "column",
        border: isSelected
          ? `2px solid ${theme.palette.secondary.main}` // Use secondary color
          : "2px solid transparent",
        transition: "border 0.3s ease",
      }}
    >
      <CardActionArea
        disableRipple
        sx={{ display: "flex", flexDirection: "column", height: "100%" }}
        onClick={onSelect}
      >
        <CardMedia
          component="img"
          height="320"
          image={imgLocation}
          alt={speciesName}
        />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <CardContent>
            <Typography
              variant="h5"
              textAlign="center"
              sx={{ fontStyle: "italic", textDecoration: "underline" }}
            >
              {speciesName}
            </Typography>
            <Typography
              variant="caption"
              color="secondary"
              textAlign="center"
              sx={{ display: "block" }}
            >
              {commonName}
            </Typography>
            <Typography variant="body2" textAlign="justify" padding={1}>
              {speciesDescription}
            </Typography>
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default SpeciesCardNoButton;
