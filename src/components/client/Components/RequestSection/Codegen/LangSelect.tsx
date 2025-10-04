'use client';

import { Select, MenuItem } from '@mui/material';
import React from 'react';

import { LangSelectProps, ReadonlyFC } from '@/types';

import styles from '../RequestSection.module.css';

const LangSelect: ReadonlyFC<LangSelectProps> = ({ langs, selectedLang, onSelect }) => {
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
          opacity: 1,
        },
        minWidth: 180,
      }}
      inputProps={{
        'data-value': selectedLang,
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
