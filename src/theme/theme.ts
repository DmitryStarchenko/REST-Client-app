import { createTheme } from '@mui/material/styles';

const colors = {
  primaryMain: '#a200a2ff',
  secondaryMain: '#f0f',
  bgDefault: '#f5f5f5ff',
  bgPaper: '#ffffff',
  textPrimary: '#111111',
  textSecondary: '#555555',
  bgHeader: '#f5f5f599',
  bgBurgerMenu: '#ffffffcc',
};

const colorsDark = {
  primaryMain: '#7e077e',
  secondaryMain: '#f0f',
  bgDefault: '#121212ff',
  bgPaper: '#1e1e1e',
  textPrimary: '#ffffff',
  textSecondary: '#aaaaaa',
  bgHeader: '#12121299',
  bgBurgerMenu: '#121212cc',
};

export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: colors.primaryMain },
        secondary: { main: colors.secondaryMain },
        background: { default: colors.bgDefault, paper: colors.bgPaper },
        text: { primary: colors.textPrimary, secondary: colors.textSecondary },
        custom: { header: colors.bgHeader, burger: colors.bgBurgerMenu },
      },
    },
    dark: {
      palette: {
        primary: { main: colorsDark.primaryMain },
        secondary: { main: colorsDark.secondaryMain },
        background: { default: colorsDark.bgDefault, paper: colorsDark.bgPaper },
        text: { primary: colorsDark.textPrimary, secondary: colorsDark.textSecondary },
        custom: { header: colorsDark.bgHeader, burger: colorsDark.bgBurgerMenu },
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
      burger: string;
    };
  }
  interface PaletteOptions {
    custom: {
      header: string;
      burger: string;
    };
  }
}
