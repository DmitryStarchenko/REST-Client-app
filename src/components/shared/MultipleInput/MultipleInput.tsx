'use client';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

import { IVariable, ReadonlyFC } from '@/types';

interface MultipleInputsProps {
  inputs: IVariable[];
  onChange: (id?: number, input?: { key?: string; value?: string }) => void;
  disabled: boolean;
}

const MultipleInputs: ReadonlyFC<MultipleInputsProps> = ({ inputs, onChange, disabled }) => {
  const t = useTranslations('MultipleInputs');
  return (
    <Box>
      <Typography variant="h4" mb={5} textAlign="center">
        {t('Variables')}
      </Typography>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <IconButton aria-label="add" size="large" onClick={() => onChange()}>
          <AddIcon />
        </IconButton>
      </Stack>
      <Stack spacing={1} sx={{ mt: 1 }}>
        {inputs.map((input) => (
          <Stack direction="row" spacing={1} key={input.id}>
            <TextField
              placeholder={t('Key')}
              value={input.key}
              onChange={(e) => onChange(input.id, { key: e.target.value })}
              size="small"
            />
            <TextField
              placeholder={t('Value')}
              value={input.value}
              onChange={(e) => onChange(input.id, { value: e.target.value })}
              size="small"
              sx={{ flex: 1 }}
            />
            <IconButton aria-label="remove" onClick={() => onChange(input.id)} size="small">
              <RemoveIcon />
            </IconButton>
          </Stack>
        ))}
        <Button disabled={disabled}>{t('Save')}</Button>
      </Stack>
    </Box>
  );
};

export default MultipleInputs;
