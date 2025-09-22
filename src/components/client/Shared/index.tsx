'use client';

import Editor from '@monaco-editor/react';
import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import React from 'react';

import { themeAtom } from '@/store';
import { CodeEditorProps } from '@/types';

import { CopyButton } from './CopyButton';

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  height = '200px',
  language = 'plaintext',
  readOnly = false,
}) => {
  const theme = useAtomValue(themeAtom);
  return (
    <Box sx={{ mt: 1, borderRadius: 1, overflow: 'hidden', position: 'relative' }}>
      <Editor
        data-testid="code-editor"
        value={value}
        height={height}
        language={language}
        theme={theme}
        onChange={(val) => onChange?.(val ?? '')}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: 'ui-monospace, monospace',
          automaticLayout: true,
          readOnly,
        }}
      />
      <CopyButton getValue={() => value} />
    </Box>
  );
};
