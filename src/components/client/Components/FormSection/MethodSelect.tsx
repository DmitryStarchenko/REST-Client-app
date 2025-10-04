'use client';

import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import React from 'react';

import { METHODS, METHOD_STYLES } from '@/constants';
import { HttpMethod, MethodSelectProps, ReadonlyFC } from '@/types';

type getStyleType = (method: HttpMethod) => { color: string };

import styles from './RequestForm.module.css';

const MethodSelect: ReadonlyFC<MethodSelectProps> = ({ value, onChange, ...selectProps }) => {
  const handleChange = (event: SelectChangeEvent<unknown>): void => {
    const method = event.target.value as HttpMethod;
    if (METHODS.includes(method)) {
      onChange(method);
    }
  };

  const getSelectStyle: getStyleType = (method: HttpMethod) => ({
    color: METHOD_STYLES[method]?.color || 'inherit',
    border: `1px solid ${METHOD_STYLES[method]?.borderColor || 'transparent'}`,
  });

  const getMenuItemStyle: getStyleType = (method: HttpMethod) => ({
    color: METHOD_STYLES[method].color,
  });

  return (
    <Select
      value={value}
      onChange={handleChange}
      fullWidth
      size="small"
      className={styles.select}
      sx={{
        '& .MuiSelect-select': getSelectStyle(value as HttpMethod),
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
          className={styles.menuItem}
          sx={getMenuItemStyle(method)}
        >
          {method}
        </MenuItem>
      ))}
    </Select>
  );
};

export default MethodSelect;
