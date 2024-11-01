import { useState, useEffect } from "react";

import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { LoaderFunction, useLoaderData, useNavigate } from "react-router-dom";

import { useAppStore } from "../state/AppStore";

import { GeneAnnotation } from "../Models";

export const loader: LoaderFunction = (): GeneAnnotation[] => {
  return useAppStore.getState().geneAnnotations;
};

const GeneTableDisplay = () => {
  const navigate = useNavigate();
  const geneAnnotations = useLoaderData() as GeneAnnotation[];
  const [selected, setSelected] = useState<boolean[]>(
    geneAnnotations.map((_) => true)
  );

  const selectedGenes = useAppStore((state) => state.selectedGenes);
  const setSelectedGenes = useAppStore((state) => state.setSelectedGenes);

  useEffect(() => {
    // we want to redirect to the "/" route if the user refreshes the page
    if (geneAnnotations.length === 0) navigate("/");
    // need to reset selected for geneAnnotations somehow
    // when submit button is clicked in the /gene-list route
    // either that or disable the submit button /gene-list
  }, [geneAnnotations]);

  return (
    <Grid container spacing={2}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/heatmap")}
      >
        Heatmap
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/responsive-heatmap")}
      >
        Responsive Heatmap
      </Button>
      <TableContainer component={Paper} sx={{ maxHeight: 859 }}>
        <Table stickyHeader size="medium">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="secondary"
                  checked={
                    selectedGenes.filter((value) => value).length ===
                      selectedGenes.length && selectedGenes.length > 0
                  } // Fully checked if all are selected
                  indeterminate={
                    selectedGenes.filter((value) => value).length > 0 &&
                    selectedGenes.filter((value) => value).length !== selectedGenes.length
                  } // Indeterminate if some but not all are selected
                  onChange={(event) => {
                    if (event.target.checked) {
                      // If checked, select all
                      setSelectedGenes(selectedGenes.map(() => true));
                    } else {
                      // If unchecked, deselect all
                      setSelectedGenes(selectedGenes.map(() => false));
                    }
                  }}
                />
              </TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Chromosome ID</TableCell>
              <TableCell>Gene ID</TableCell>
              <TableCell>Tool</TableCell>
              <TableCell>Annotation</TableCell>
              <TableCell>E-Value</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {geneAnnotations.map((value, index) => (
              <TableRow
                key={index}
                hover
                selected={selectedGenes[index] && value.evalue !== null}
                onClick={() => {
                  const newSelectedGenes = [...selectedGenes];
                  if (value.evalue !== null) {
                    newSelectedGenes[index] = !selectedGenes[index]; // Toggle the selection state of this particular row
                  }
                  setSelectedGenes(newSelectedGenes); // Update the state

                }}
                sx={{ cursor: "pointer", color: "secondary" }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="secondary"
                    // checked={selected[index] && value.evalue !== null}
                    checked={selectedGenes[index]}
                    onChange={() => {
                      const newSelected = [...selected];
                      newSelected[index] = !selected[index]; // Toggle the selection state of this particular row
                      setSelected(newSelected); // Update the state
                      const newSelectedGenes = [...selectedGenes];
                      if (value.evalue !== null) {
                        newSelectedGenes[index] = !selectedGenes[index]; // Toggle the selection state of this particular row
                      }
                      setSelectedGenes(newSelectedGenes); // Update the state
                    }}
                    disabled={value.evalue === null} // Disable checkbox if e-value is null
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{value.chromosomeId}</TableCell>
                <TableCell>{value.geneId}</TableCell>
                <TableCell>{value.tool}</TableCell>
                <TableCell>{value.description}</TableCell>
                <TableCell>{value.evalue?.toPrecision(3)}</TableCell>
                <TableCell>{value.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};

export default GeneTableDisplay;
