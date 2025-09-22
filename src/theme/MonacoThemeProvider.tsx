'use client';

import { useMonaco } from '@monaco-editor/react';
import { useMediaQuery } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { useSetAtom } from 'jotai';
import { useLayoutEffect } from 'react';

import { themeAtom } from '@/store';

export const MonacoThemeProvider = (): null => {
  const { mode } = useColorScheme();
  const monaco = useMonaco();
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  const setMonacoTheme = useSetAtom(themeAtom);

  useLayoutEffect(() => {
    if (!monaco) return;
    const systemMode = mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode;
    setMonacoTheme(systemMode === 'dark' ? 'vs-dark' : 'vs');
  }, [mode, monaco, prefersDark, setMonacoTheme]);

  return null;
};
