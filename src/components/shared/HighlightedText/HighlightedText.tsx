'use client';

import { Box } from '@mui/material';
import React, { useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { VARIABLES_KEY, VARIABLES_SEARCH_REGEX } from '@/constants';
import { IVariable, ReadonlyFC } from '@/types';

interface HighlightedTextProps {
  text: string;
  className?: string;
}

const HighlightedText: ReadonlyFC<HighlightedTextProps> = ({ text, className }) => {
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
    <Box
      className={className}
      sx={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        lineHeight: '1.4375em',
        fontFamily: 'inherit',
        display: 'flex',
        alignItems: 'center',
        minHeight: '1.4375em',
        flexWrap: 'wrap',
        letterSpacing: 0.15,
      }}
    >
      {highlightedText.map((part, index) => {
        if (!part.isVariable) {
          return (
            <span
              key={index}
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {part.text}
            </span>
          );
        }

        return (
          <Box
            key={index}
            component="span"
            sx={{
              backgroundColor: part.variableKey ? 'secondary.main' : 'error.light',
              borderRadius: '3px',
              lineHeight: 1.6,
              display: 'inline-block',
              verticalAlign: 'middle',
            }}
            title={part.variableKey ? `Variables: ${part.variableKey}` : 'Unknown variables'}
          >
            {part.text}
          </Box>
        );
      })}
    </Box>
  );
};

export default HighlightedText;
