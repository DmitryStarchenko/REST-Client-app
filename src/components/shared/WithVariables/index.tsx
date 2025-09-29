'use client';

import { Box } from '@mui/material';
import React, {
  cloneElement,
  isValidElement,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useVariableAutocomplete } from '@/hooks';
import { ReadonlyFC, WithVariablesProps } from '@/types';

import HighlightedText from '../HighlightedText/HighlightedText';
import VariableAutocomplete from '../VariableAutocomplete/';

const WithVariables: ReadonlyFC<WithVariablesProps> = ({
  value,
  onChange,
  children,
  showHighlight = true,
}) => {
  const {
    showAutocomplete,
    targetElement,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    closeAutocomplete,
  } = useVariableAutocomplete();

  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevShowAutocompleteRef = useRef(showAutocomplete);

  const handleClickOutside = useCallback(
    (event: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeAutocomplete();
      }
    },
    [closeAutocomplete],
  );

  useEffect(() => {
    if (showAutocomplete && !prevShowAutocompleteRef.current) {
      document.addEventListener('mousedown', handleClickOutside);
    } else if (!showAutocomplete && prevShowAutocompleteRef.current) {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    prevShowAutocompleteRef.current = showAutocomplete;

    return () => {
      if (showAutocomplete) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [handleClickOutside, showAutocomplete]);

  const enhancedHandleFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(true);
      handleInputFocus(event);
    },
    [handleInputFocus],
  );

  const enhancedHandleBlur = useCallback(
    (_event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(false);
      handleInputBlur();
    },
    [handleInputBlur],
  );

  const childrenProps = useMemo(
    () => ({
      value: value,
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        handleInputChange(event, value, onChange),
      onFocus: enhancedHandleFocus,
      onBlur: enhancedHandleBlur,
    }),
    [enhancedHandleBlur, enhancedHandleFocus, handleInputChange, onChange, value],
  );

  if (!isValidElement(children)) {
    console.warn('WithVariables: children must be a valid React element');
    return children as ReactElement;
  }

  const childrenWithProps = cloneElement(children, { ...childrenProps });

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {childrenWithProps}

      {showHighlight && value && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '14px',
            paddingRight: '14px',
            opacity: isFocused ? 0.5 : 1,
          }}
        >
          <HighlightedText text={value} />
        </Box>
      )}

      {showAutocomplete && (
        <VariableAutocomplete
          value={value}
          onChange={onChange}
          target={targetElement}
          onClose={closeAutocomplete}
          isOpen={showAutocomplete}
        />
      )}
    </div>
  );
};

export default WithVariables;
