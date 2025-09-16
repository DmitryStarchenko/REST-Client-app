'use client';

import { Box, Stack, Typography } from '@mui/material';
import React from 'react';

import { ResponseBlockProps } from '@/types';

import { CodeEditor } from '../Shared';

const ResponseBlock: React.FC<ResponseBlockProps> = ({ response, errorMessage }) => {
  const getResponseContent = (): string => {
    if (!response) return 'No response yet';

    if (errorMessage) return errorMessage;

    if (response.ok) {
      return typeof response.data === 'string'
        ? response.data
        : JSON.stringify(response.data, null, 2);
    } else {
      return response.error ?? 'Error response';
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          mb: 2,
        }}
      >
        <Typography variant="subtitle1">Response</Typography>

        {errorMessage ? (
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
            <Typography variant="body2" color="error">
              {errorMessage}
            </Typography>
            <Typography variant="body2" color="error">
              Timestamp: {response?.timestamp ?? '-'}
            </Typography>
          </Stack>
        ) : (
          response && (
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
              <Typography variant="body2" color="success">
                Status: {response.status ?? '-'}
              </Typography>
              <Typography variant="body2" color="success">
                StatusText: {response.statusText ?? '-'}
              </Typography>
              <Typography variant="body2" color="success">
                Success: {String(response.ok)}
              </Typography>
              <Typography variant="body2" color="success">
                Duration: {response.durationMs ?? '-'} ms
              </Typography>
              <Typography variant="body2" color="success">
                Response: {response.responseSize ?? '-'} bytes
              </Typography>
              <Typography variant="body2" color="success">
                Timestamp: {response.timestamp ?? '-'}
              </Typography>
            </Stack>
          )
        )}
      </Box>

      <CodeEditor value={getResponseContent()} height="200px" language="json" readOnly />

      {!errorMessage && response?.headers && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">Headers</Typography>
          <CodeEditor
            value={JSON.stringify(response.headers, null, 2)}
            height="150px"
            language="json"
            readOnly
          />
        </Box>
      )}
    </>
  );
};

export default ResponseBlock;
