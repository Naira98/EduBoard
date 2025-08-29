import { createTheme, ThemeProvider } from "@mui/material/styles";
import { type ReactNode } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0d9488",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default CustomThemeProvider;
