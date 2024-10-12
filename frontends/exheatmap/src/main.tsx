import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Root, { geneIdsAction } from "./routes/Root";
import Index from "./routes/Index";
import GeneTableDisplay, {
  loader as geneTableLoader,
} from "./routes/GeneTableDisplay";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    action: geneIdsAction,
    children: [
      { index: true, element: <Index /> },
      {
        path: "gene-list",
        element: <GeneTableDisplay />,
        loader: geneTableLoader,
      },
      {
        path: "heatmap",
        element: <div>Heatmap</div>,
      },
      { path: "network", element: <div>Network</div> },
    ],
  },
]);

const RootContainer = () => {
  const themeOptions: ThemeOptions = {
    palette: {
      mode: "dark",
      primary: {
        // main: "#312f38",
        main: "#9EBF6D"
      },
      secondary: {
        // main: "#17990e",
        main: "#8E6DBF"
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
