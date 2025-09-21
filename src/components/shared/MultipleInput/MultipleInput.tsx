'use client';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import React from 'react';

import { IVariable, ReadonlyFC } from '@/types';

interface MultipleInputsProps {
  inputs: IVariable[];
  onChange: (id?: number, input?: { key?: string; value?: string }) => void;
  label: string;
}

const MultipleInputs: ReadonlyFC<MultipleInputsProps> = ({ inputs, onChange, label }) => {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">{label}</Typography>
        <IconButton size="small" onClick={() => onChange()}>
          <AddIcon />
        </IconButton>
      </Stack>
      <Stack spacing={1} sx={{ mt: 1 }}>
        {inputs.map((input) => (
          <Stack direction="row" spacing={1} key={input.id}>
            <TextField
              placeholder="Key"
              value={input.key}
              onChange={(e) => onChange(input.id, { key: e.target.value })}
              size="small"
            />
            <TextField
              placeholder="Value"
              value={input.value}
              onChange={(e) => onChange(input.id, { value: e.target.value })}
              size="small"
              sx={{ flex: 1 }}
            />
            <IconButton onClick={() => onChange(input.id)} size="small">
              <RemoveIcon />
            </IconButton>
          </Stack>
        ))}
        <Button sx={{}}>Save</Button>
      </Stack>
    </Box>
  );
};

export default MultipleInputs;
