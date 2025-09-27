export interface UseVariableAutocompleteReturn {
  showAutocomplete: boolean;
  targetElement: HTMLTextAreaElement | HTMLInputElement | null;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    currentValue: string,
    onChange: (value: string) => void,
  ) => void;
  handleInputFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleInputBlur: () => void;
  closeAutocomplete: () => void;
}
