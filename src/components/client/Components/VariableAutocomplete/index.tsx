'use client';

import { Box } from '@mui/material';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { VARIABLES_KEY } from '@/constants';
import { IVariable, ReadonlyFC, VariableAutocompleteProps } from '@/types';

import styles from './VariableAutocomplete.module.css';
import { VariableList } from './VariableList';

const VariableAutocomplete: ReadonlyFC<VariableAutocompleteProps> = ({
  value,
  onChange,
  target,
  onClose,
  isOpen,
  onEnterPress,
}) => {
  const [variables] = useLocalStorage<IVariable[]>(VARIABLES_KEY, []);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const selectedIndexRef = useRef(0);
  const filteredVariablesRef = useRef<IVariable[]>([]);

  const filteredVariables = useMemo(() => {
    if (!target || !isOpen) return [];

    const currentText = value.substring(0, target?.selectionStart || 0);
    const lastDoubleOpenBrace = currentText.lastIndexOf('{{');

    if (lastDoubleOpenBrace === -1) return [];

    const searchText = currentText.substring(lastDoubleOpenBrace + 2).toLowerCase();

    const result = variables.filter(
      (variable) => variable.key.toLowerCase().includes(searchText) && variable.key.trim() !== '',
    );

    filteredVariablesRef.current = result;

    return result;
  }, [value, variables, target, isOpen]);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  const handleVariableSelect = useCallback(
    (variable: IVariable) => {
      if (!target) return;

      const currentText = value;
      const cursorPos = target.selectionStart || 0;
      const textBeforeCursor = currentText.substring(0, cursorPos);
      const lastOpenBrace = textBeforeCursor.lastIndexOf('{');

      if (lastOpenBrace === -1) return;

      const textAfterCursor = currentText.substring(cursorPos);
      const newText =
        currentText.substring(0, lastOpenBrace) + `{${variable.key}}}` + textAfterCursor;

      onChange(newText);
      onClose();

      Promise.resolve().then(() => {
        const newCursorPos = lastOpenBrace + `{${variable.key}}}`.length;
        target.setSelectionRange(newCursorPos, newCursorPos);
        target.focus();
      });
    },
    [onChange, onClose, target, value],
  );

  const insertVariableTemplate = useCallback(() => {
    if (!target) return;

    const currentText = value;
    const cursorPos = target.selectionStart || 0;
    const newText = currentText.substring(0, cursorPos) + '{{}}' + currentText.substring(cursorPos);

    onChange(newText);

    Promise.resolve().then(() => {
      target.setSelectionRange(cursorPos + 2, cursorPos + 2);
      target.focus();
    });
  }, [onChange, target, value]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen || filteredVariablesRef.current.length === 0) {
        if (event.key === 'Enter' && onEnterPress) {
          event.preventDefault();
          event.stopPropagation();
          onEnterPress();
        }
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          event.stopPropagation();
          setSelectedIndex((prev) => {
            const newIndex = (prev + 1) % filteredVariablesRef.current.length;
            return newIndex;
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          event.stopPropagation();
          setSelectedIndex((prev) => {
            const newIndex =
              (prev - 1 + filteredVariablesRef.current.length) %
              filteredVariablesRef.current.length;
            return newIndex;
          });
          break;
        case 'Enter':
          event.preventDefault();
          event.stopPropagation();
          if (filteredVariablesRef.current[selectedIndexRef.current]) {
            handleVariableSelect(filteredVariablesRef.current[selectedIndexRef.current]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          event.stopPropagation();
          onClose();
          break;
        case '{':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            event.stopPropagation();
            insertVariableTemplate();
          }
          break;
        default:
          break;
      }
    },
    [isOpen, onClose, handleVariableSelect, insertVariableTemplate, onEnterPress],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown, true);
      return () => {
        document.removeEventListener('keydown', handleKeyDown, true);
      };
    }
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    if (filteredVariables.length > 0) {
      setSelectedIndex(0);
      selectedIndexRef.current = 0;
    }
  }, [filteredVariables]);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted || !target || !filteredVariables.length || !isOpen) {
    return null;
  }

  const rect = target.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return (
    <Box
      className={styles.autocompleteContainer}
      sx={{
        top: scrollTop + rect.height,
      }}
    >
      <VariableList
        variables={filteredVariables}
        selectedIndex={selectedIndex}
        onVariableSelect={handleVariableSelect}
      />
    </Box>
  );
};

export default VariableAutocomplete;
