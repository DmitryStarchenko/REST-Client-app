'use client';

import Editor from '@monaco-editor/react';
import { Box, Typography } from '@mui/material';
import React from 'react';

import { ApiResponse } from '@/types';

interface ResponseBlockProps {
  response: ApiResponse | null;
  errorMessage: string | null;
  theme: string;
}

const ResponseBlock: React.FC<ResponseBlockProps> = ({ response, errorMessage, theme }) => {
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
      <Box sx={{ mt: 1, borderRadius: 1, overflow: 'hidden' }}>
        <Editor
          height="200px"
          language="json"
          value={getResponseContent()}
          theme={theme}
          options={{ minimap: { enabled: false }, readOnly: true }}
        />
      </Box>
    </Box>
  );
};

export default ResponseBlock;
