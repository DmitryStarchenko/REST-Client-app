import { SelectProps } from '@mui/material';

import { METHODS } from '@/constants';

export type HttpMethod = (typeof METHODS)[number];

export interface MethodStyle {
  backgroundColor?: string;
  color: string;
  borderColor?: string;
}

export interface MethodSelectProps extends Omit<SelectProps, 'value' | 'onChange'> {
  value: string;
  onChange: (method: HttpMethod) => void;
}
