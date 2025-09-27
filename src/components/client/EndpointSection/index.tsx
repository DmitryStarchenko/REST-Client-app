'use client';
import { Grid, Select, MenuItem, TextField, Button, Stack, Paper } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

import WithVariables from '@/components/shared/WithVariables';
import { METHODS } from '@/constants';
import { ReadonlyFC, RequestFormProps } from '@/types';

const RequestForm: ReadonlyFC<RequestFormProps> = ({
  method,
  setMethod,
  url,
  setUrl,
  sendRequest,
  loading,
}) => {
  const t = useTranslations('RequestForm');
  return (
    <Paper
      elevation={1}
      sx={{ p: 2, mb: 2, backgroundColor: 'var(--mui-palette-background-paper)' }}
    >
      <Grid container spacing={2} alignItems="center" sx={{ mt: 1.5, display: 'flex' }}>
        <Grid sx={{ xs: 12, md: 2 }}>
          <Select
            value={method}
            onChange={(e) => setMethod(String(e.target.value))}
            fullWidth
            size="small"
          >
            {METHODS.map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid sx={{ flexGrow: 1, position: 'relative' }}>
          <WithVariables value={url} onChange={setUrl}>
            <TextField
              id="endpoint-url"
              label={t('Endpoint URL')}
              placeholder="https://jsonplaceholder.typicode.com/posts/1"
              fullWidth
              size="small"
            />
          </WithVariables>
        </Grid>

        <Grid sx={{ xs: 12, md: 2 }}>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={sendRequest} loading={loading}>
              {t(`Send`)}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RequestForm;
