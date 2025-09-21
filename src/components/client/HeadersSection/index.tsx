'use client';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import React from 'react';

import { Header } from '@/types';
import { uid } from '@/utils';

interface HeadersBlockProps {
  headers: Header[];
  setHeaders: (headers: Header[]) => void;
}

const HeadersBlock: React.FC<HeadersBlockProps> = ({ headers, setHeaders }) => {
  const addHeader = (): void => setHeaders([...headers, { key: '', value: '', id: uid() }]);
  const removeHeader = (id: string): void => setHeaders(headers.filter((h) => h.id !== id));
  const updateHeader = (id: string, key: string, value: string): void =>
    setHeaders(headers.map((h) => (h.id === id ? { ...h, key, value } : h)));

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">Headers</Typography>
        <IconButton size="small" onClick={addHeader}>
          <AddIcon />
        </IconButton>
      </Stack>
      <Stack spacing={1} sx={{ mt: 1 }}>
        {headers.map((h) => (
          <Stack direction="row" spacing={1} key={h.id}>
            <TextField
              placeholder="Header name"
              value={h.key}
              onChange={(e) => updateHeader(h.id, e.target.value, h.value)}
              size="small"
            />
            <TextField
              placeholder="Header value"
              value={h.value}
              onChange={(e) => updateHeader(h.id, h.key, e.target.value)}
              size="small"
              sx={{ flex: 1 }}
            />
            <IconButton onClick={() => removeHeader(h.id)} size="small">
              <RemoveIcon />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default HeadersBlock;
