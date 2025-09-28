import { ReactElement } from 'react';

export interface WithVariablesProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactElement<{
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  }>;
  showHighlight: boolean;
}
