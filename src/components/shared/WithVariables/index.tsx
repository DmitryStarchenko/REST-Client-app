import React, {
  cloneElement,
  isValidElement,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { useVariableAutocomplete } from '@/hooks';
import { ReadonlyFC, WithVariablesProps } from '@/types';

import VariableAutocomplete from '../VariableAutocomplete/';

export const WithVariables: ReadonlyFC<WithVariablesProps> = ({ value, onChange, children }) => {
  const {
    showAutocomplete,
    targetElement,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    closeAutocomplete,
  } = useVariableAutocomplete();

  const containerRef = useRef<HTMLDivElement>(null);
  const prevShowAutocompleteRef = useRef(showAutocomplete);

  const handleClickOutside = useCallback(
    (e: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  const childrenProps = useMemo(
    () => ({
      value: value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        handleInputChange(e, value, onChange),
      onFocus: handleInputFocus,
      onBlur: handleInputBlur,
    }),
    [handleInputBlur, handleInputChange, handleInputFocus, onChange, value],
  );

  if (!isValidElement(children)) {
    console.warn('WithVariables: children must be a valid React element');
    return children as ReactElement;
  }

  const childrenWithProps = cloneElement(children, childrenProps);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {childrenWithProps}
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
