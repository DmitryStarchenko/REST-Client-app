import { createTheme } from '@mui/material/styles';

const colors = {
  primaryMain: '#1976d2',
  secondaryMain: '#9c27b0',
  bgDefault: '#f5f5f5',
  bgPaper: '#ffffff',
  textPrimary: '#111111',
  textSecondary: '#555555',
};

const colorsDark = {
  primaryMain: '#90caf9',
  secondaryMain: '#ce93d8',
  bgDefault: '#121212',
  bgPaper: '#1e1e1e',
  textPrimary: '#ffffff',
  textSecondary: '#aaaaaa',
};

export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: colors.primaryMain },
        secondary: { main: colors.secondaryMain },
        background: { default: colors.bgDefault, paper: colors.bgPaper },
        text: { primary: colors.textPrimary, secondary: colors.textSecondary },
      },
    },
    dark: {
      palette: {
        primary: { main: colorsDark.primaryMain },
        secondary: { main: colorsDark.secondaryMain },
        background: { default: colorsDark.bgDefault, paper: colorsDark.bgPaper },
        text: { primary: colorsDark.textPrimary, secondary: colorsDark.textSecondary },
      },
    },
  },
  cssVariables: {
    colorSchemeSelector: 'data',
  },
});
