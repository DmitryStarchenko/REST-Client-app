'use client';

import { TextField } from '@mui/material';
import React from 'react';

import InfoTooltip from '@/components/shared/InfoTooltip/InfoTooltip';
import WithVariables from '@/components/shared/WithVariables';
import { HeaderFieldProps, ReadonlyFC } from '@/types';

const HeaderField: ReadonlyFC<HeaderFieldProps> = ({
  value,
  onChange,
  placeholder,
  incomplete = false,
  tooltipText = '',
  flex = 1,
}) => {
  return (
    <WithVariables value={value} onChange={onChange} showHighlight={true}>
      <TextField
        fullWidth
        placeholder={placeholder}
        size="small"
        sx={{
          flex,
          '& .MuiInputBase-input': {
            position: 'relative',
            zIndex: 2,
            backgroundColor: 'transparent',
          },
        }}
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
