import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import Root from "./routes/Root.tsx";
import FileUpload from "./routes/FileUpload.tsx";

const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#312f38",
    },
    secondary: {
      main: "#17990e",
    },
  },
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/file-upload",
    element: <FileUpload />
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={createTheme(themeOptions)}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
