'use client';

import { IconButton, Tooltip } from '@mui/material';
import React from 'react';

import { ReadonlyFC, TooltipButtonProps } from '@/types';

const TooltipButton: ReadonlyFC<TooltipButtonProps> = ({
  tooltipText,
  tooltipProps,
  onClick,
  children,
  ...iconButtonProps
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    onClick?.(e);
  };

  return (
    <Tooltip title={tooltipText} {...tooltipProps}>
      <IconButton {...iconButtonProps} onClick={handleClick}>
        {children}
      </IconButton>
    </Tooltip>
  );
};

export default TooltipButton;
