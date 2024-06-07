import { createTheme, responsiveFontSizes } from "@mui/material";
import '@fontsource/fira-sans-extra-condensed';

const defaultTheme = createTheme({
  typography: {
    "fontFamily": `"Fira Sans Extra Condensed", "Helvetica", "Arial", sans-serif`,
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