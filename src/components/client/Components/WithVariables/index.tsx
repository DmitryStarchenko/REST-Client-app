'use client';

import { Box } from '@mui/material';
import React from 'react';

import { ReadonlyFC, WithVariablesProps } from '@/types';

import { VariableAutocompleteWrapper } from './VariableAutocompleteWrapper';
import { VariableHighlight } from './VariableHighlight';
import { useWithVariables } from '../../hooks';

const WithVariables: ReadonlyFC<WithVariablesProps> = ({
  value,
  onChange,
  children,
  showHighlight = true,
}) => {
  const {
    isFocused,
    containerRef,
    highlightRef,
    showAutocomplete,
    targetElement,
    childrenProps,
    closeAutocomplete,
    showHighlight: shouldShowHighlight,
  } = useWithVariables({ value, onChange, showHighlight });

  const enhancedChildren = React.isValidElement(children)
    ? React.cloneElement(children, { ...childrenProps })
    : children;

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%' }}>
      {enhancedChildren}

      <VariableHighlight
        value={value}
        isFocused={isFocused}
        highlightRef={highlightRef}
        showHighlight={shouldShowHighlight}
      />

      <VariableAutocompleteWrapper
        showAutocomplete={showAutocomplete}
        value={value}
        onChange={onChange}
        target={targetElement}
        onClose={closeAutocomplete}
      />
    </Box>
  );
};

export default WithVariables;
