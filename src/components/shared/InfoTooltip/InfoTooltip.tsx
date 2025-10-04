'use client';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { InputAdornment, Tooltip } from '@mui/material';
import React from 'react';

import { InfoTooltipProps, ReadonlyFC } from '@/types';

export const InfoTooltip: ReadonlyFC<InfoTooltipProps> = ({
  tooltipText,
  testId = 'info-icon',
  placement = 'right',
  color = 'warning',
  opacity = 0.6,
}) => {
  return (
    <InputAdornment position="end">
      <Tooltip arrow placement={placement} title={tooltipText}>
        <InfoOutlined color={color} fontSize="small" opacity={opacity} data-testid={testId} />
      </Tooltip>
    </InputAdornment>
  );
};

export default InfoTooltip;
