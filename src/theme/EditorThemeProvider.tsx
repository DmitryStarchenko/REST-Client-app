'use client';

import { useColorScheme } from '@mui/material/styles';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { muiModeToMonaco } from '@/constants';
import { themeAtom } from '@/store';

export const EditorThemeProvider = (): null => {
  const { mode } = useColorScheme();
  const setEditorTheme = useSetAtom(themeAtom);

  useEffect(() => {
    if (mode) {
      setEditorTheme(muiModeToMonaco[mode] ?? 'light');
    }
  }, [mode, setEditorTheme]);

  return null;
};
