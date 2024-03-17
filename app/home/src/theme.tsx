import { createTheme, responsiveFontSizes } from "@mui/material";

const defaultTheme = createTheme({
  typography: {
    "fontFamily": `"Bangers", "Helvetica", "Arial", sans-serif`,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500
  },
  components: {
    // Name of the component
    MuiButton: {
      defaultProps: {
      },
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          fontSize: '1.2rem',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      },
    }
  },
});

const theme = responsiveFontSizes(defaultTheme);

export default theme;