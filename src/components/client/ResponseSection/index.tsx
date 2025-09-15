'use client';

import Editor from '@monaco-editor/react';
import { Box, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import React from 'react';

import { themeAtom } from '@/store';
import { ApiResponse } from '@/types';

import CopyButton from '../Shared/CopyButton';

interface ResponseBlockProps {
  response: ApiResponse | null;
  errorMessage: string | null;
}

const ResponseBlock: React.FC<ResponseBlockProps> = ({ response, errorMessage }) => {
  const getResponseContent = (): string => {
    if (!response) return 'Not response yet';
    if ('ok' in response && response.ok) {
      return typeof response.data === 'string'
        ? response.data
        : JSON.stringify(response.data, null, 2);
    } else {
      return response?.error ?? 'Error response';
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1">Response</Typography>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      <Box sx={{ mt: 1, borderRadius: 1, overflow: 'hidden', position: 'relative' }}>
        <Editor
          theme={useAtomValue(themeAtom)}
          height="200px"
          language="json"
          value={getResponseContent()}
          options={{ minimap: { enabled: false }, readOnly: true }}
        />
        <CopyButton getValue={() => getResponseContent()} />
      </Box>
    </Box>
  );
};

export default ResponseBlock;
