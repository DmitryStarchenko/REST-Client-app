import { useState, useCallback } from 'react';

import { UseVariableAutocompleteReturn } from '@/types';

export const useVariableAutocomplete = (): UseVariableAutocompleteReturn => {
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [targetElement, setTargetElement] = useState<HTMLTextAreaElement | HTMLInputElement | null>(
    null,
  );

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      currentValue: string,
      onChange: (value: string) => void,
    ) => {
      const value = e.target.value;
      onChange(value);

      const cursorPos = e.target.selectionStart || 0;
      const textBeforeCursor = value.substring(0, cursorPos);
      const lastDoubleOpenBrace = textBeforeCursor.lastIndexOf('{{');

      if (lastDoubleOpenBrace !== -1) {
        const textAfterDoubleBrace = textBeforeCursor.substring(lastDoubleOpenBrace);
        const hasClosingBrace = textAfterDoubleBrace.includes('}}');

        if (!hasClosingBrace) {
          setTargetElement(e.target);
          setShowAutocomplete(true);
          return;
        }
      }
      setShowAutocomplete(false);
    },
    [],
  );

  const handleInputFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      const cursorPos = e.target.selectionStart || 0;
      const textBeforeCursor = value.substring(0, cursorPos);

      const lastDoubleOpenBrace = textBeforeCursor.lastIndexOf('{{');
      if (lastDoubleOpenBrace !== -1) {
        const textAfterDoubleBrace = textBeforeCursor.substring(lastDoubleOpenBrace);
        const hasClosingBrace = textAfterDoubleBrace.includes('}}');

        if (!hasClosingBrace) {
          setTargetElement(e.target);
          setShowAutocomplete(true);
          return;
        }
      }
      setShowAutocomplete(false);
    },
    [],
  );

  const handleInputBlur = useCallback(() => {
    const timer = setTimeout(() => setShowAutocomplete(false), 150);
    return () => clearTimeout(timer);
  }, []);

  const closeAutocomplete = useCallback(() => {
    setShowAutocomplete(false);
  }, []);

  return {
    showAutocomplete,
    targetElement,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    closeAutocomplete,
  };
};
