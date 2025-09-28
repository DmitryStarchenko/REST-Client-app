'use client';

import { Alert, Box, Slide, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { VARIABLES_KEY } from '@/constants';
import { IVariable, ReadonlyFC } from '@/types';

import MultipleInputs from '../shared/MultipleInput/MultipleInput';

interface VariablesProps {}

const Variables: ReadonlyFC<VariablesProps> = () => {
  const [variables, setVariables] = useLocalStorage<IVariable[]>(VARIABLES_KEY, []);
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(true);

  const handleVariablesChange = (id?: number, input?: { key?: string; value?: string }): void => {
    if (id) {
      const newVars = [...variables];
      const varIndex = newVars.findIndex((item) => item.id === id);

      if (input) {
        if (input.key || input.key === '') {
          if (input.key !== '' && variables.find((vars) => vars.key === input.key)) {
            setError('Variable key should be unique!');
          } else if (!/(\w+)/.test(input.key)) {
            setError('Variable key should be contain only letters, digits, or underscore!');
          } else {
            setError('');
          }

          newVars[varIndex].key = input.key;
        } else if (input.value || input.value === '') {
          newVars[varIndex].value = input.value;
        }
        setVariables(newVars);
      } else {
        setVariables((vars) => vars.filter((varItem) => varItem.id !== id));
      }
    } else {
      setDisabled(false);
      setVariables((vars) => [
        ...vars,
        {
          id: vars.length > 0 ? Math.max(...vars.map((varItem) => varItem.id)) + 1 : 1,
          key: '',
          value: '',
        },
      ]);
    }
  };

  useEffect(() => {
    if (variables.length === 0) {
      setDisabled(true);
    }
  }, [variables]);
  return (
    <Box sx={{ maxWidth: 600, margin: 'auto' }}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={Boolean(error)}
        onClose={() => setError('')}
        autoHideDuration={2000}
        slots={{ transition: Slide }}
      >
        <Alert
          onClose={() => setError('')}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
      <MultipleInputs inputs={variables} onChange={handleVariablesChange} disabled={disabled} />
    </Box>
  );
};

export default Variables;
