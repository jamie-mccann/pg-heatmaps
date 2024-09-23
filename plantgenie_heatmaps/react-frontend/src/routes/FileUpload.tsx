import { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useAppStore } from "../state/AppStore";

const FileUpload = () => {
  const species = useAppStore((state) => state.species);
  const file = useAppStore((state) => state.file);
  const setFile = useAppStore((state) => state.setFile);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      console.log(`file size = ${event.target.files[0].size}`);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput")?.click();
  };

  const handleGoButtonClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate(`/${species}/gene-list`);
  };

  return (
    <Grid container padding={2} justifyContent="center">
      <Grid sx={{ display: "none" }}>
        <input id="fileInput" type="file" onChange={handleFileChange} />
      </Grid>
      <Grid container flexDirection="column" alignItems="center" spacing={1}>
        <Typography variant="h4" textAlign="center">
          {species}
        </Typography>
        <Typography variant="h3" textAlign="center">
          Import your gene list!
        </Typography>
        <Typography variant="body1" textAlign="center">
          Click on the input below to import a gene list for retrieving gene
          expression data.
        </Typography>
        <Typography variant="body1" textAlign="center">
          Once you have uploaded a valid file, click the submit button to see a
          table of the genes that were found in your file.
        </Typography>
        <TextField
          slotProps={{
            input: { readOnly: true, startAdornment: <AttachFileIcon /> },
          }}
          label={null}
          value={file ? file.name : "Upload a gene list"}
          color="secondary"
          sx={{
            "& .MuiInputBase-input": {
              textAlign: "center",
            },
            "& .MuiFormHelperText-root": {
              textAlign: "center", // Center align the helper text
            },
            "& .MuiOutlinedInput-root": {
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "green", // Change the color on hover
              },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "blue", // Border color when focused
              },
            },
          }}
          helperText={
            file
              ? `File size: ${(file.size / 10 ** 6).toFixed(2)} MB`
              : "Choose a file to import."
          }
          onClick={handleUploadClick}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleGoButtonClick}
        >
          Go
        </Button>
      </Grid>
    </Grid>
  );
};

export default FileUpload;
