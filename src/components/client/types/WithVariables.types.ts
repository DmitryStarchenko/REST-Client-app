import { PopperChildrenProps } from 'node_modules/@mui/material/esm/Popper/BasePopper.types';
import { RefObject } from 'react';

export interface UseWithVariablesProps {
  value: string;
  onChange: (value: string) => void;
  showHighlight?: boolean;
}

export interface WithVariablesProps extends UseWithVariablesProps {
  children: React.ReactElement;
}

export interface UseVariableAutocompleteReturn {
  showAutocomplete: boolean;
  targetElement: HTMLTextAreaElement | HTMLInputElement | null;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    currentValue: string,
    onChange: (value: string) => void,
  ) => void;
  handleInputFocus: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleInputBlur: () => void;
  closeAutocomplete: () => void;
}

export interface useWithVariablesReturn {
  isFocused: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  highlightRef: RefObject<HTMLDivElement | null>;
  showAutocomplete: boolean;
  targetElement: HTMLInputElement | HTMLTextAreaElement | null;
  childrenProps: PopperChildrenProps;
  closeAutocomplete: () => void;
  showHighlight: boolean;
}

export interface ChildrenProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  sx: {
    '& .MuiInputBaseInput': string;
    autoComplete: string;
  };
}

export interface UseWithVariablesReturn {
  isFocused: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  highlightRef: React.RefObject<HTMLDivElement | null>;
  showAutocomplete: boolean;
  targetElement: HTMLTextAreaElement | HTMLInputElement | null;
  childrenProps: ChildrenProps;
  closeAutocomplete: () => void;
  showHighlight: boolean;
}

export interface VariableAutocompleteWrapperProps {
  showAutocomplete: boolean;
  value: string;
  onChange: (value: string) => void;
  target: HTMLTextAreaElement | HTMLInputElement | null;
  onClose: () => void;
}

export interface VariableHighlightProps {
  value: string;
  isFocused: boolean;
  highlightRef: React.RefObject<HTMLDivElement | null>;
  showHighlight: boolean;
}
