import { TooltipProps } from '@mui/material';

export interface InfoTooltipProps {
  tooltipText: string;
  testId?: string;
  placement?: TooltipProps['placement'];
  color?: 'warning' | 'error' | 'info' | 'success';
  opacity?: number;
}
