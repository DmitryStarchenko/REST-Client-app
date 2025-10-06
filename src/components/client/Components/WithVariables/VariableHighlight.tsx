'use client';

import { Box } from '@mui/material';
import React from 'react';

import { ReadonlyFC } from '@/types';

import styles from './WithVariables.module.css';
import { VariableHighlightProps } from '../../types';
import HighlightedText from '../HighlightedText/HighlightedText';

export const VariableHighlight: ReadonlyFC<VariableHighlightProps> = ({
  value,
  isFocused,
  highlightRef,
  showHighlight,
}) => {
  if (!showHighlight) return null;

  return (
    <Box
      ref={highlightRef}
      className={`${styles.highlightContainer} ${
        isFocused ? styles.highlightFocused : styles.highlightNormal
      }`}
    >
      <HighlightedText text={value} />
    </Box>
  );
};
