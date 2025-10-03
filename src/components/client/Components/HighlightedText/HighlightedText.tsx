'use client';

import { Box } from '@mui/material';
import React, { useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { VARIABLES_KEY, VARIABLES_SEARCH_REGEX } from '@/constants';
import { IVariable, ReadonlyFC } from '@/types';

import styles from './HighlightedText.module.css';

interface HighlightedTextProps {
  text: string;
}

const HighlightedText: ReadonlyFC<HighlightedTextProps> = ({ text }) => {
  const [variables] = useLocalStorage<IVariable[]>(VARIABLES_KEY, []);

  const highlightedText = useMemo(() => {
    if (!text || variables.length === 0) {
      return [{ text, isVariable: false }];
    }

    const result: { text: string; isVariable: boolean; variableKey?: string }[] = [];
    let lastIndex = 0;
    let match;

    while ((match = VARIABLES_SEARCH_REGEX.exec(text)) !== null) {
      if (match.index > lastIndex) {
        result.push({
          text: text.substring(lastIndex, match.index),
          isVariable: false,
        });
      }

      const variableKey = match[1].trim();
      const variableExists = variables.some((v) => v.key === variableKey);

      result.push({
        text: match[0],
        isVariable: true,
        variableKey: variableExists ? variableKey : undefined,
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      result.push({
        text: text.substring(lastIndex),
        isVariable: false,
      });
    }

    return result;
  }, [text, variables]);

  if (!text) return null;

  return (
    <Box className={styles.container}>
      {highlightedText.map((part, index) => {
        if (!part.isVariable) {
          return (
            <span key={index} className={styles.textPart}>
              {part.text}
            </span>
          );
        }

        return (
          <Box
            key={index}
            component="span"
            className={part.variableKey ? styles.variable : styles.unknownVariable}
          >
            {part.text}
          </Box>
        );
      })}
    </Box>
  );
};

export default HighlightedText;
