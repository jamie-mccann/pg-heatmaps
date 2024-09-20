import { useAppStore } from "../state/AppStore";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import { Box, Typography } from "@mui/material";

import AttachFileIcon from "@mui/icons-material/AttachFile";

const FileUpload = () => {
  const file = useAppStore((state) => state.file);
  const setFile = useAppStore((state) => state.setFile);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      console.log(`file size = ${event.target.files[0].size}`);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput")?.click();
  };

  return (
    <Grid
      container
      padding={2}
      // sx={{ maxWidth: 1200, mx: "auto" }}
      justifyContent="center"
    >
      <Grid sx={{ display: "none" }}>
        <input id="fileInput" type="file" onChange={handleFileChange} />
      </Grid>
      <Grid container flexDirection="column" alignItems="center" spacing={1}>
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
      </Grid>
    </Grid>
  );
};

export default FileUpload;
