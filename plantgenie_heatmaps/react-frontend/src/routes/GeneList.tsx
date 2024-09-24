import Grid from "@mui/material/Grid2";
// import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { useAppStore } from "../state/AppStore";
import { useEffect, useState } from "react";

interface Result {
  chromosome_id: string;
  gene_id: string;
  genus: string;
  species: string;
  tool: string;
  annotation: string;
  evalue: number;
  score: number;
}

interface ApiResponse {
  results: Result[];
}

const GeneList = () => {
  // const species = useAppStore((state) => state.species);
  const parsedIds = useAppStore((state) => state.parsedIds);

  const [data, setData] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
            gene_ids: parsedIds.map(
              (value) => `${value.chromosomeId}_${value.geneId}`
            ),
          }),
        });

        if (!response.ok) {
          throw new Error(`Error fetching data from ${url}`);
        }

        const result: ApiResponse = await response.json();
        setData(result.results);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : `Error fetching data from ${url}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error}</p>;

  return (
    <Grid container justifyContent="center" padding={2}>
      <TableContainer component={Paper} sx={{ maxWidth: 992, width: "100%" }}>
        <Table>
          <TableHead>
            <TableRow>
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
            {data.map((value, index) => (
              <TableRow key={index}>
                <TableCell>{index+1}</TableCell>
                <TableCell>
                  {value.genus} {value.species}
                </TableCell>
                <TableCell>{value.chromosome_id}</TableCell>
                <TableCell>{value.gene_id}</TableCell>
                <TableCell>{value.tool}</TableCell>
                <TableCell>{value.annotation}</TableCell>
                <TableCell>{value.evalue}</TableCell>
                <TableCell>{value.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};

export default GeneList;
