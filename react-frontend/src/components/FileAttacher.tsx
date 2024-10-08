import { useAppStore } from "../state/AppStore";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const FileAttacher = () => {
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
    <Grid container alignItems="center" spacing={2} padding={2}>
      <Grid sx={{ display: "none" }}>
        <input id="fileInput" type="file" onChange={handleFileChange} />
      </Grid>
      <Grid>
        <TextField
          variant="outlined"
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
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#17990e",
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

export default FileAttacher;
