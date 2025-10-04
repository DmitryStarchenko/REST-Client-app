import { IconButtonProps, TooltipProps } from '@mui/material';

export interface TooltipButtonProps extends Omit<IconButtonProps, 'title'> {
  tooltipText: string;
  tooltipProps?: Omit<TooltipProps, 'children' | 'title'>;
}
