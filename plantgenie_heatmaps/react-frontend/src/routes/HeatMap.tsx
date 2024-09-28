import { useEffect, useState } from "react";
import { useAppStore } from "../state/AppStore.ts";

interface HeatMapGene {
  chromosome_id: string;
  gene_id: string;
}

interface HeatMapSample {
  experiment_id: string;
  replicate_id: number;
  stub: string;
  experiment_description: string;
}

interface HeatMapResults {
  genes: HeatMapGene[];
  samples: HeatMapSample[];
  values: number[];
}

const HeatMap = () => {
  const [data, setData] = useState<HeatMapResults | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const parsedIds = useAppStore((state) => state.parsedIds);

  useEffect(() => {
    const fetchData = async () => {
      const url = "http://localhost:8080/api/expression_data";

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
          throw {
            name: "DataFetchError",
            message: `Unable to fetch data from ${url}`,
          } as Error;
        }

        const result: HeatMapResults = await response.json();
        setData(result);
        console.log(result);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return <p>Hello from Heatmap!</p>
};

export default HeatMap;
