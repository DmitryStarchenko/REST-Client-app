import { useColorScheme } from '@mui/material/styles';
import React, { FC } from 'react';

import { Mode } from '@/types/theme.types';

const ThemeToggler: FC = () => {
  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return null;
  }

  return (
    <select
      value={mode}
      onChange={(event) => {
        setMode(event.target.value as Mode);
      }}
    >
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
};

export default ThemeToggler;
