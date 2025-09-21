'use client';

import { Tabs, Tab, Tooltip } from '@mui/material';
import React from 'react';

import { LANG_ICONS } from '@/constants';

interface LangTabsProps {
  langs: string[];
  selectedLang: string;
  onSelect: (lang: string) => void;
}

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
      {langs.map((lang) => {
        const Icon = LANG_ICONS[lang];
        const label = lang.replace('_', ' ');
        const iconNode = Icon ? (
          <Tooltip title={label} arrow placement="top">
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Icon size={16} />
            </span>
          </Tooltip>
        ) : undefined;
        const labelNode = !Icon ? (
          <Tooltip title={label} arrow placement="top">
            <span>{label}</span>
          </Tooltip>
        ) : undefined;
        return (
          <Tab
            key={lang}
            value={lang}
            icon={iconNode}
            label={labelNode}
            iconPosition="start"
            aria-label={label}
          />
        );
      })}
    </Tabs>
  );
};

export default LangTabs;
