import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import React from 'react';

import { HeadersBlockProps } from '@/types';
import { uid } from '@/utils';

const HeadersBlock: React.FC<HeadersBlockProps> = ({ headers, setHeaders }) => {
  const handleChange = (id: string, key: string, value: string): void => {
    const newHeaders = headers.map((h) => (h.id === id ? { ...h, key, value } : h));
    const last = newHeaders[newHeaders.length - 1];
    if (last.key !== '' || last.value !== '') {
      newHeaders.push({ key: '', value: '', id: uid() });
    }
    setHeaders(newHeaders);
  };

  const handleRemove = (id: string): void => {
    if (headers.length <= 1) return;
    const newHeaders = headers.filter((h) => h.id !== id);
    setHeaders(newHeaders);
  };

  return (
    <Box>
      <Typography variant="subtitle1">Headers</Typography>
      <Stack spacing={1} sx={{ mt: 1 }}>
        {headers.map((h) => (
          <Stack direction="row" spacing={1} key={h.id}>
            <TextField
              placeholder="Header name"
              value={h.key}
              onChange={(e) => handleChange(h.id, e.target.value, h.value)}
              size="small"
            />
            <TextField
              placeholder="Header value"
              value={h.value}
              onChange={(e) => handleChange(h.id, h.key, e.target.value)}
              size="small"
              sx={{ flex: 1 }}
            />
            <IconButton
              onClick={() => handleRemove(h.id)}
              disabled={headers.length === 1}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default HeadersBlock;
