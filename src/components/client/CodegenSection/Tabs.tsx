'use client';

import { Tabs } from '@mui/material';
import React from 'react';

import { LangTabsProps } from '@/types';

import LangTab from './Tab';

const LangTabs: React.FC<LangTabsProps> = ({ langs, selectedLang, onSelect }) => {
  return (
    <Tabs
      value={selectedLang}
      onChange={(_, v) => onSelect(v as string)}
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
      aria-label="Language tabs"
    >
      {langs.map((lang) => (
        <LangTab key={lang} lang={lang} />
      ))}
    </Tabs>
  );
};

export default LangTabs;
