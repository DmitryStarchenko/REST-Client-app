'use client';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

import { IVariable, ReadonlyFC } from '@/types';

import styles from './MultipleInput.module.css';

interface FieldError {
  id: number;
  keyError: string;
}

interface MultipleInputsProps {
  inputs: IVariable[];
  change: (id?: number, input?: { key?: string; value?: string }) => void;
  fieldErrors?: FieldError[];
  disabled: boolean;
  onSave: () => void;
  hasUnsavedChanges: boolean;
}

const MultipleInputs: ReadonlyFC<MultipleInputsProps> = ({
  inputs,
  change,
  fieldErrors = [],
  disabled,
  onSave,
  hasUnsavedChanges,
}) => {
  const t = useTranslations('MultipleInputs');

  const getFieldError = (id: number): string => {
    const error = fieldErrors.find((error) => error.id === id);
    return error?.keyError || '';
  };

  return (
    <Box>
      <Typography variant="h4" mb={5} textAlign="center">
        {t('Variables')}
      </Typography>
      <Stack spacing={1} sx={{ mt: 1 }}>
        {inputs.map((input) => {
          const keyError = getFieldError(input.id);
          return (
            <Stack className={styles.fields} direction={'row'} key={input.id}>
              <TextField
                placeholder={t('Key')}
                value={input.key}
                onChange={(event) => change(input.id, { key: event.target.value })}
                size="small"
                error={Boolean(keyError)}
                helperText={t(keyError)}
                sx={{ minWidth: 150 }}
              />
              <TextField
                placeholder={t('Value')}
                value={input.value}
                onChange={(event) => change(input.id, { value: event.target.value })}
                size="small"
              />
              <IconButton
                className={styles.removeIconButton}
                aria-label="remove"
                onClick={() => change(input.id)}
                size="small"
              >
                <RemoveIcon className={styles.removeIcon} />
              </IconButton>
            </Stack>
          );
        })}
      </Stack>
      <Stack className={styles.buttons}>
        <IconButton
          className={styles.addButton}
          aria-label="add"
          size="large"
          onClick={() => change()}
        >
          <AddIcon className={styles.icon} />
        </IconButton>
        <Button
          disabled={disabled}
          onClick={onSave}
          className={styles.saveButton}
          variant="contained"
        >
          {hasUnsavedChanges ? t('Save') : t('Saved')}
        </Button>
        {!disabled && (
          <Typography className={styles.message} variant="caption">
            {t('Message')}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default MultipleInputs;
