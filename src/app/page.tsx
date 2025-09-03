'use client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useState, useEffect } from 'react';

import { lightTheme, darkTheme } from '@/theme/theme';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    if (saved) setMode(saved);
    document.documentElement.setAttribute('data-theme', saved ?? mode);
  }, []);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    document.documentElement.setAttribute('data-theme', newMode);
    localStorage.setItem('theme', newMode);
  };

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
          <CssBaseline />
          <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 z-50 p-2 rounded"
            style={{ backgroundColor: 'var(--primary-main)', color: 'var(--text-primary)' }}
          >
            Toggle Theme
          </button>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
