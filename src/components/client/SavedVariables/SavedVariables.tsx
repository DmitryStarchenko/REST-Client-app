import { Box, Typography } from '@mui/material';
import React from 'react';

import { IVariable, ReadonlyFC } from '@/types';

interface SavedVariablesProps {
  variables: IVariable[];
}

const SavedVariables: ReadonlyFC<SavedVariablesProps> = ({ variables }) => {
  return (
    <Box sx={{ marginBottom: 10 }}>
      <Typography variant="subtitle1">Variables: </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 1,
          borderRadius: 1,
          overflowX: 'hidden',
          overflowY: 'scroll',
          maxHeight: 400,
        }}
      >
        {variables.map((variable) => (
          <Box key={variable.id} sx={{ display: 'flex', gap: 5 }}>
            <Box sx={{ flex: 1 }}>{`{{${variable.key}}}`}: </Box>
            <Box sx={{ flex: 3 }}>{variable.value}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SavedVariables;
