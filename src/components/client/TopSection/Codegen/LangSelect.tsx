'use client';

import { Select, MenuItem } from '@mui/material';
import React from 'react';

import { LangSelectProps } from '@/types';

import styles from '../TopSection.module.css';

const LangSelect: React.FC<LangSelectProps> = ({ langs, selectedLang, onSelect }) => {
  return (
    <Select
      data-testid="lang-select"
      className={styles.selector}
      value={selectedLang}
      onChange={(e) => onSelect(e.target.value)}
      size="small"
      sx={{
        opacity: 0.6,
        '&:hover': {
          opacity: 0.8,
        },
        minWidth: 180,
      }}
    >
      {langs.map((lang) => (
        <MenuItem key={lang} value={lang}>
          {lang.replace('_', ' ')}
        </MenuItem>
      ))}
    </Select>
  );
};

export default LangSelect;
