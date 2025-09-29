'use client';

import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { z } from 'zod';

import { VARIABLES_KEY } from '@/constants';
import { IVariable, ReadonlyFC } from '@/types';

import { variableKeySchema } from './variableKeySchema';
import MultipleInputs from '../shared/MultipleInput/MultipleInput';

const Variables: ReadonlyFC = () => {
  const [savedVariables, setSavedVariables] = useLocalStorage<IVariable[]>(VARIABLES_KEY, []);
  const [unsavedVariables, setUnsavedVariables] = useState<IVariable[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setUnsavedVariables(savedVariables);
  }, [savedVariables]);

  const validateKey = (key: string, currentId?: number): string => {
    try {
      variableKeySchema.parse(key);
      const isDuplicate = unsavedVariables.some(
        (variable) => variable.key === key && variable.id !== currentId,
      );

      if (isDuplicate) {
        return 'Variable key should be unique!';
      }

      return '';
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error._zod.def[0].message;
      }
      return 'Invalid key';
    }
  };

  const handleVariablesChange = (id?: number, input?: { key?: string; value?: string }): void => {
    let newVariables: IVariable[];

    if (id) {
      if (input) {
        newVariables = unsavedVariables.map((variable) =>
          variable.id === id ? { ...variable, ...input } : variable,
        );
      } else {
        newVariables = unsavedVariables.filter((variable) => variable.id !== id);
      }
    } else {
      const newId =
        unsavedVariables.length > 0
          ? Math.max(...unsavedVariables.map((variable) => variable.id)) + 1
          : 1;
      newVariables = [...unsavedVariables, { id: newId, key: '', value: '' }];
    }

    setUnsavedVariables(newVariables);
  };

  const handleSave = (): void => {
    setSavedVariables(unsavedVariables);
  };

  useEffect(() => {
    if (unsavedVariables.length === savedVariables.length) {
      setHasUnsavedChanges(false);
    } else {
      setHasUnsavedChanges(true);
    }
  }, [unsavedVariables]);

  const fieldErrors = unsavedVariables.map((variable) => ({
    id: variable.id,
    keyError: validateKey(variable.key, variable.id),
  }));

  const hasValidationErrors = fieldErrors.some((error) => error.keyError !== '');
  const isSaveDisabled =
    !hasUnsavedChanges || hasValidationErrors || savedVariables.length === unsavedVariables.length;

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto' }}>
      <MultipleInputs
        inputs={unsavedVariables}
        change={handleVariablesChange}
        fieldErrors={fieldErrors}
        disabled={isSaveDisabled}
        onSave={handleSave}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    </Box>
  );
};

export default Variables;
