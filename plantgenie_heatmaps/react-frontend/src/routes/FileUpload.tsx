import { ChangeEvent, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { usePapaParse } from "react-papaparse";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useAppStore } from "../state/AppStore";
import { GeneListId } from "../state/SliceTypes";
import { IconButton } from "@mui/material";

const FileUpload = () => {
  const species = useAppStore((state) => state.species);
  const file = useAppStore((state) => state.file);
  const setParsedIds = useAppStore((state) => state.setParsedIds);
  const setFile = useAppStore((state) => state.setFile);
  const navigate = useNavigate();
  const { readString } = usePapaParse();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      console.log(`file size = ${selectedFile.size}`);

      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result?.toString();
        if (fileContent) {
          readString(fileContent, {
            header: false,
            delimiter: ",",
            skipEmptyLines: true,
            complete: (result) => {
              console.log(result.data);
              const parsedData = (result.data as string[][]).map(
                (row: string[]) =>
                  ({
                    chromosomeId: row[0].trim(),
                    geneId: row[1].trim(),
                  } as GeneListId)
              );
              setParsedIds(parsedData);
            },
            error: (error) => console.error("Error parsing file:", error),
          });
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput")?.click();
  };

  const handleGoButtonClick = (event: MouseEvent) => {
    event.preventDefault();
    if (!file) {
      return;
    }
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
            input: {
              readOnly: true,
              startAdornment: <AttachFileIcon />,
              // endAdornment: file && (
              //   <IconButton
              //     onClick={(event: MouseEvent) => {
              //       event.stopPropagation();
              //       setFile(null);
              //     }}
              //     edge="end"
              //   >
              //     <CloseIcon />
              //   </IconButton>
              // ),
            },
          }}
          label={null}
          placeholder="Upload a gene list"
          // value={file ? file.name : ""}
          value={file?.name || ""}
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
          disabled={file ? false : true}
        >
          Go
        </Button>
      </Grid>
    </Grid>
  );
};

export default FileUpload;
