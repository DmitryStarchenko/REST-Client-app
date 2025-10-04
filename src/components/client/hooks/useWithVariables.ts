'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useVariableAutocomplete } from './useVariableAutocomplete';
import { ChildrenProps, UseWithVariablesProps, UseWithVariablesReturn } from '../types';

export const useWithVariables = ({
  value,
  onChange,
  showHighlight = true,
}: UseWithVariablesProps): UseWithVariablesReturn => {
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
  const highlightRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (highlightRef.current && targetElement && value.includes('{{')) {
      const syncScroll = (): void => {
        highlightRef.current!.scrollLeft = targetElement.scrollLeft;
      };

      targetElement.addEventListener('scroll', syncScroll);
      return () => targetElement.removeEventListener('scroll', syncScroll);
    }
  }, [targetElement, value]);

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

  const childrenProps: ChildrenProps = useMemo(
    () => ({
      value: value,
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        handleInputChange(event, value, onChange),
      onFocus: enhancedHandleFocus,
      onBlur: enhancedHandleBlur,
      sx: {
        '& .MuiInputBaseInput': 'styles.inputBase',
        autoComplete: 'off',
      },
    }),
    [enhancedHandleBlur, enhancedHandleFocus, handleInputChange, onChange, value],
  );

  return {
    isFocused,
    containerRef,
    highlightRef,
    showAutocomplete,
    targetElement,
    childrenProps,
    closeAutocomplete,
    showHighlight: showHighlight && value.includes('{{'),
  };
};
