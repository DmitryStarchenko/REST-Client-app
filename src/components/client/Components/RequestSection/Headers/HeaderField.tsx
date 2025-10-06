'use client';

import { TextField } from '@mui/material';
import React from 'react';

import WithVariables from '@/components/client/Components/WithVariables';
import { HeaderFieldProps } from '@/components/client/types';
import InfoTooltip from '@/components/shared/InfoTooltip/InfoTooltip';
import { ReadonlyFC } from '@/types';

import styles from './HeadersBlock.module.css';

const HeaderField: ReadonlyFC<HeaderFieldProps> = ({
  value,
  onChange,
  placeholder,
  incomplete = false,
  tooltipText = '',
  className = '',
}) => {
  return (
    <WithVariables value={value} onChange={onChange} showHighlight={true}>
      <TextField
        fullWidth
        placeholder={placeholder}
        size="small"
        className={`${styles.input} ${className}`}
        slotProps={{
          input: {
            endAdornment: incomplete ? <InfoTooltip tooltipText={tooltipText} /> : null,
          },
        }}
      />
    </WithVariables>
  );
};

export default HeaderField;
