'use client';

import { Select, MenuItem } from '@mui/material';
import React from 'react';

import { LangSelectProps } from '@/types';

const LangSelect: React.FC<LangSelectProps> = ({ langs, selectedLang, onSelect }) => {
  return (
    <Select
      value={selectedLang}
      onChange={(e) => onSelect(e.target.value)}
      size="small"
      sx={{
        width: '100%',
        opacity: 0.4,
        '&:hover': {
          opacity: 0.6,
        },
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
