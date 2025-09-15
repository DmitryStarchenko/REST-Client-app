import { createTheme } from '@mui/material/styles';

const colors = {
  primaryMain: '#7e077e',
  secondaryMain: '#f0f',
  bgDefault: '#f5f5f5',
  bgPaper: '#ffffff',
  textPrimary: '#111111',
  textSecondary: '#555555',
  bgHeader: '#f5f5f599',
};

const colorsDark = {
  primaryMain: '#7e077e',
  secondaryMain: '#f0f',
  bgDefault: '#121212',
  bgPaper: '#1e1e1e',
  textPrimary: '#ffffff',
  textSecondary: '#aaaaaa',
  bgHeader: '#12121299',
};

export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: colors.primaryMain },
        secondary: { main: colors.secondaryMain },
        background: { default: colors.bgDefault, paper: colors.bgPaper },
        text: { primary: colors.textPrimary, secondary: colors.textSecondary },
        custom: { header: colors.bgHeader },
      },
    },
    dark: {
      palette: {
        primary: { main: colorsDark.primaryMain },
        secondary: { main: colorsDark.secondaryMain },
        background: { default: colorsDark.bgDefault, paper: colorsDark.bgPaper },
        text: { primary: colorsDark.textPrimary, secondary: colorsDark.textSecondary },
        custom: { header: colorsDark.bgHeader },
      },
    },
  },
  cssVariables: {
    colorSchemeSelector: 'data',
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      header: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      header?: string;
    };
  }
}
