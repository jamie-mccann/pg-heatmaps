import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import Root from "./routes/Root.tsx";
import FileUpload from "./routes/FileUpload.tsx";
import { useAppStore } from "./state/AppStore.ts";
import GeneList from "./routes/GeneList.tsx";
import HeatMap from "./routes/HeatMap.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/:speciesId/file-upload",
    element: <FileUpload />,
  },
  {
    path: "/:speciesId/gene-list",
    element: <GeneList />,
  },
  {
    path: "/:speciesId/heatmap",
    element: <HeatMap />
  }
]);

const RootContainer = () => {
  const theme = useAppStore((state) => state.style);
  const themeOptions: ThemeOptions = {
    palette: {
      mode: theme,
      primary: {
        main: "#312f38",
      },
      secondary: {
        main: "#17990e",
      },
    },
  };

  return (
    <ThemeProvider theme={createTheme(themeOptions)}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootContainer />
  </StrictMode>
);
