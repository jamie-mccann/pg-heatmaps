import { useEffect, useState } from "react";

import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { AnnotationsResponse, GeneAnnotation } from "../models";


interface GeneTableProps {
  geneIds: string[];
  geneAnnotations: GeneAnnotation[];
  setGeneAnnotations: (newGeneAnnotations: GeneAnnotation[]) => void;
}

const GeneTable = ({
  geneIds,
  geneAnnotations,
  setGeneAnnotations,
}: GeneTableProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<boolean[]>([]);

  useEffect(() => {
    console.log(`Gene ids in GeneTable: ${geneIds.length}`);
    if (geneIds.length === 0) return;

    const fetchData = async () => {
      const url = "http://localhost:8080/api/genes";
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gene_ids: geneIds,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error fetching data from ${url}`);
        }

        const result: AnnotationsResponse = await response.json();
        setGeneAnnotations(result.results);
        setSelected(result.results.map((_) => true));
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : `Error fetching data from ${url}`
        );
      } finally {
        setLoading(false);
      }

      return undefined;
    };

    fetchData();
  }, [geneIds]);

  if (loading)
    return (
      <Typography variant="h6" color="warning">
        Loading...
      </Typography>
    );

  if (error)
    return (
      <Typography variant="h6" color="error">
        Error: {error}
      </Typography>
    );

  return (
    <Grid>
      <TableContainer component={Paper} sx={{ maxHeight: 859 }}>
        <Table stickyHeader size="medium">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={
                    selected.filter((value) => value).length ===
                      selected.length && selected.length > 0
                  } // Fully checked if all are selected
                  indeterminate={
                    selected.filter((value) => value).length > 0 &&
                    selected.filter((value) => value).length !== selected.length
                  } // Indeterminate if some but not all are selected
                  onChange={(event) => {
                    if (event.target.checked) {
                      // If checked, select all
                      setSelected(selected.map(() => true));
                    } else {
                      // If unchecked, deselect all
                      setSelected(selected.map(() => false));
                    }
                  }}
                />
              </TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Species</TableCell>
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
                selected={selected[index] && value.evalue !== null}
                onClick={() => {
                  const newSelected = [...selected];
                  newSelected[index] = !selected[index]; // Toggle the selection state of this particular row
                  setSelected(newSelected); // Update the state
                }}
                sx={{ cursor: "pointer" }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selected[index] && value.evalue !== null}
                    onChange={() => {
                      const newSelected = [...selected];
                      newSelected[index] = !selected[index]; // Toggle the selection state of this particular row
                      setSelected(newSelected); // Update the state
                    }}
                    disabled={value.evalue === null} // Disable checkbox if e-value is null
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {value.genus} {value.species}
                </TableCell>
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

export default GeneTable;
