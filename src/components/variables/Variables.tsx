'use client';

import { Box } from '@mui/material';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { z } from 'zod';

import { VARIABLES_KEY } from '@/constants';
import { IVariable, ReadonlyFC } from '@/types';

import { variableKeySchema } from './variableKeySchema';
import MultipleInputs from '../shared/MultipleInput/MultipleInput';

const Variables: ReadonlyFC = () => {
  const [savedVariables, setSavedVariables] = useLocalStorage<IVariable[]>(VARIABLES_KEY, []);
  const [unsavedVariables, setUnsavedVariables] = useState<IVariable[]>(savedVariables);

  useEffect(() => {
    setUnsavedVariables(savedVariables);
  }, [savedVariables]);

  const validateKey = useCallback(
    (key: string, currentId?: number): string => {
      try {
        variableKeySchema.parse(key);
        const isDuplicate = unsavedVariables.some(
          (variable) => variable.key === key && variable.id !== currentId,
        );

        return isDuplicate ? 'Variable key should be unique!' : '';
      } catch (error) {
        return error instanceof z.ZodError
          ? error._zod.def[0].message || 'Invalid key'
          : 'Invalid key';
      }
    },
    [unsavedVariables],
  );

  const handleVariablesChange = useCallback(
    (id?: number, input?: { key?: string; value?: string }): void => {
      if (id) {
        if (input) {
          setUnsavedVariables((prev) =>
            prev.map((variable) => (variable.id === id ? { ...variable, ...input } : variable)),
          );
        } else {
          setUnsavedVariables((prev) => prev.filter((variable) => variable.id !== id));
        }
      } else {
        const newId =
          unsavedVariables.length > 0
            ? Math.max(...unsavedVariables.map((variable) => variable.id)) + 1
            : 1;
        setUnsavedVariables((prev) => [...prev, { id: newId, key: '', value: '' }]);
      }
    },
    [unsavedVariables],
  );

  const handleSave = useCallback((): void => {
    setSavedVariables(unsavedVariables);
  }, [unsavedVariables, setSavedVariables]);

  const hasUnsavedChanges = useMemo(() => {
    if (unsavedVariables.length !== savedVariables.length) return true;

    const savedMap = new Map(savedVariables.map((variable) => [variable.id, variable]));
    return unsavedVariables.some((unsavedVar) => {
      const savedVar = savedMap.get(unsavedVar.id);
      return !savedVar || unsavedVar.key !== savedVar.key || unsavedVar.value !== savedVar.value;
    });
  }, [unsavedVariables, savedVariables]);

  const fieldErrors = useMemo(
    () =>
      unsavedVariables.map((variable) => ({
        id: variable.id,
        keyError: validateKey(variable.key, variable.id),
      })),
    [unsavedVariables, validateKey],
  );

  const hasValidationErrors = useMemo(
    () => fieldErrors.some((error) => error.keyError !== ''),
    [fieldErrors],
  );

  const isSaveDisabled = !hasUnsavedChanges || hasValidationErrors;

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
