'use client';

import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

import { lightTheme, darkTheme } from './theme';

interface ThemeContextType {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  toggleTheme: () => {},
  mode: 'light',
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <MUIThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
