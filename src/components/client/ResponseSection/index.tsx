'use client';

import { Typography } from '@mui/material';
import React, { Fragment } from 'react';

import { ResponseBlockProps } from '@/types';

import { CodeEditor } from '../Shared';

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
    <>
      <Typography variant="subtitle1">Response</Typography>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      <CodeEditor value={getResponseContent()} height="200px" language="json" readOnly />
    </>
  );
};

export default ResponseBlock;
