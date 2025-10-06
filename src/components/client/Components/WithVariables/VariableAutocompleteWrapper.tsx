'use client';

import React from 'react';

import { ReadonlyFC } from '@/types';

import { VariableAutocompleteWrapperProps } from '../../types';
import VariableAutocomplete from '../VariableAutocomplete';

export const VariableAutocompleteWrapper: ReadonlyFC<VariableAutocompleteWrapperProps> = ({
  showAutocomplete,
  value,
  onChange,
  target,
  onClose,
}) => {
  if (!showAutocomplete) return null;

  return (
    <VariableAutocomplete
      value={value}
      onChange={onChange}
      target={target}
      onClose={onClose}
      isOpen={showAutocomplete}
    />
  );
};
