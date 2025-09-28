import { ListItemButton, ListItemText, Paper, Typography, Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';

import { ReadonlyFC, VariableListProps } from '@/types';

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
    <Paper elevation={3} sx={{ overflow: 'auto', maxHeight: '200px', maxWidth: 'auto-fit' }}>
      {variables.map((variable, index) => (
        <ListItemButton
          key={`${variable.id}-${variable.key}`}
          ref={index === selectedIndex ? selectedItemRef : null}
          selected={index === selectedIndex}
          onClick={() => onVariableSelect(variable)}
          sx={{
            '&.Mui-selected': {
              backgroundColor: 'secondary.main.light',
              '&:hover': {
                backgroundColor: 'secondary.light',
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
              <Box
                component="span"
                sx={{
                  opacity: 0,
                  transition: 'opacity 0.1s ease-in-out',
                  '.MuiListItemButton-root:hover &': {
                    opacity: 1,
                  },
                }}
              >
                <Typography variant="caption" color="text.secondary" noWrap>
                  {variable.value || 'Empty value'}
                </Typography>
              </Box>
            }
          />
        </ListItemButton>
      ))}
    </Paper>
  );
};
