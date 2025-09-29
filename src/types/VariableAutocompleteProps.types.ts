export interface VariableAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  target: HTMLTextAreaElement | HTMLInputElement | null;
  onClose: () => void;
  isOpen: boolean;
  onEnterPress?: () => void;
}
