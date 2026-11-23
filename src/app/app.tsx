import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router";
import { appRouter } from "./router";
import { appTheme } from "./theme";

export function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <RouterProvider router={appRouter} />
    </ThemeProvider>
  );
}
