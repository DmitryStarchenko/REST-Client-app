'use client';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LanguageIcon from '@mui/icons-material/Language';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useColorScheme } from '@mui/material/styles';
import React from 'react';

import { ReadonlyFC } from '@/types/readonly.types';
import { Mode } from '@/types/theme.types';

import styles from './ThemeToggler.module.css';

const ThemeToggler: ReadonlyFC = () => {
  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return null;
  }

  const toggleMode = (): void => {
    const modes: Mode[] = ['system', 'light', 'dark'];
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
  };

  return (
    <button onClick={toggleMode} className={styles.toggler}>
      {mode === 'system' ? (
        <LanguageIcon />
      ) : mode === 'light' ? (
        <LightModeIcon />
      ) : (
        <DarkModeIcon />
      )}
    </button>
  );
};

export default ThemeToggler;
