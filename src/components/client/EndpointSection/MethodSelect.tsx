'use client';

import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import React from 'react';

import { METHODS, METHOD_STYLES } from '@/constants';
import { HttpMethod, MethodSelectProps, ReadonlyFC } from '@/types';

const MethodSelect: ReadonlyFC<MethodSelectProps> = ({ value, onChange, ...selectProps }) => {
  const handleChange = (event: SelectChangeEvent<unknown>): void => {
    const method = event.target.value as HttpMethod;
    if (METHODS.includes(method)) {
      onChange(method);
    }
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      fullWidth
      size="small"
      sx={{
        width: 125,
        '& .MuiSelect-select': {
          color: METHOD_STYLES[value as HttpMethod]?.color || 'inherit',
          fontWeight: 600,
          border: `1px solid ${METHOD_STYLES[value as HttpMethod]?.borderColor || 'transparent'}`,
          borderRadius: '3px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
      }}
      {...selectProps}
    >
      {METHODS.map((method) => (
        <MenuItem
          key={method}
          value={method}
          sx={{
            color: METHOD_STYLES[method].color,
            fontWeight: 600,
            borderRadius: '3px',
            margin: '2px',
            opacity: 0.5,
            '&:hover': {
              opacity: 1,
            },
            '&.Mui-selected': {
              backgroundColor: METHOD_STYLES[method].backgroundColor,
              color: METHOD_STYLES[method].color,
              '&:hover': {
                opacity: 1,
              },
            },
          }}
        >
          {method}
        </MenuItem>
      ))}
    </Select>
  );
};

export default MethodSelect;
