import { ListItemButton, ListItemText, Typography } from '@mui/material';
import React from 'react';

import { IVariable, ReadonlyFC } from '@/types';

interface VariableListProps {
  variables: IVariable[];
  selectedIndex: number;
  onVariableSelect: (variable: IVariable) => void;
}

export const VariableList: ReadonlyFC<VariableListProps> = ({
  variables,
  selectedIndex,
  onVariableSelect,
}) => {
  if (variables.length === 0) return null;

  return (
    <>
      {variables.map((variable, index) => (
        <ListItemButton
          key={`${variable.id}-${variable.key}`}
          selected={index === selectedIndex}
          onClick={() => onVariableSelect(variable)}
          sx={{
            '&.Mui-selected': {
              backgroundColor: 'primary.light',
              '&:hover': {
                backgroundColor: 'primary.main',
              },
            },
          }}
        >
          <ListItemText
            primary={
              <Typography variant="body2" component="span">
                <strong>{variable.key}</strong>
              </Typography>
            }
            secondary={
              <Typography variant="caption" color="text.secondary" noWrap>
                {variable.value || 'Empty value'}
              </Typography>
            }
          />
        </ListItemButton>
      ))}
    </>
  );
};
