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
import VariableAutocomplete from '../VariableAutocomplete';

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
    if (highlightRef.current && targetElement) {
      const syncScroll = (): void => {
        highlightRef.current!.scrollLeft = targetElement.scrollLeft;
      };

      targetElement.addEventListener('scroll', syncScroll);
      return () => targetElement.removeEventListener('scroll', syncScroll);
    }
  }, [targetElement]);

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
      sx: {
        '& .MuiInputBase-input': {
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        },
      },
    }),
    [enhancedHandleBlur, enhancedHandleFocus, handleInputChange, onChange, value],
  );

  if (!isValidElement(children)) {
    console.warn('WithVariables: children must be a valid React element');
    return children as ReactElement;
  }

  const childrenWithProps = cloneElement(children, { ...childrenProps });

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%' }}>
      {childrenWithProps}

      {showHighlight && value.includes('{{') && (
        <Box
          ref={highlightRef}
          sx={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            left: '14px',
            right: '14px',
            pointerEvents: 'none',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            opacity: isFocused ? 0.5 : 1,
            width: 'calc(100% - 28px)',
            overflowX: 'auto',
            overflowY: 'hidden',
            whiteSpace: 'nowrap',
            height: '1.4375em',
            lineHeight: '1.4375em',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
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
    </Box>
  );
};

export default WithVariables;
