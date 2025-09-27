import { ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';

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
  const selectedItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [selectedIndex]);

  if (variables.length === 0) return null;

  return (
    <Paper elevation={3} sx={{ overflow: 'auto', maxHeight: '200px' }}>
      {variables.map((variable, index) => (
        <ListItemButton
          key={`${variable.id}-${variable.key}`}
          ref={index === selectedIndex ? selectedItemRef : null}
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
    </Paper>
  );
};
