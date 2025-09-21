'use client';

import { Box, Chip, Paper, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { IVariable, ReadonlyFC } from '@/types';

interface VariablesSectionProps {
  variables: IVariable[];
}

const VariablesSection: ReadonlyFC<VariablesSectionProps> = ({ variables }) => {
  const t = useTranslations('RestClient');

  if (!variables.length) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          {t('Variables')}
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            {t('No variables defined')}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('Variables')} ({variables.length})
      </Typography>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {variables.map((variable) => (
            <Chip
              key={variable.id}
              label={`{{${variable.key}}} = ${variable.value}`}
              variant="outlined"
              size="small"
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                bgcolor: 'background.paper',
                '& .MuiChip-label': {
                  px: 1.5,
                },
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default VariablesSection;
