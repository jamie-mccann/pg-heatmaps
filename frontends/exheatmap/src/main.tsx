import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Root from './routes/Root';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  }
])

const RootContainer = () => {
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

  return (
    <ThemeProvider theme={createTheme(themeOptions)}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootContainer />
  </StrictMode>,
)
