// @flow

import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode, createContext, useContext, useMemo } from "react";

const ThemeContext = createContext(createTheme());

export const useAppTheme = () => useContext(ThemeContext);

export const Theme = ({ children }: { children: ReactNode }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          background: {
            default: prefersDarkMode ? "#0e1116" : "#ffffff",
            paper: prefersDarkMode ? "#161b22" : "#ffffff",
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", sans-serif',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
              },
            },
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div>{children}</div>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default Theme;
