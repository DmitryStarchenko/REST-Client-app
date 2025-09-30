'use client';
import { Grid, TextField, Button, Stack, Paper } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

import WithVariables from '@/components/shared/WithVariables';
import { ReadonlyFC, RequestFormProps } from '@/types';

import MethodSelect from './MethodSelect';

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
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: 'var(--mui-palette-background-paper)',
      }}
    >
      <Grid container spacing={2} alignItems="center" sx={{ mt: 1.5, display: 'flex' }}>
        <Grid sx={{ xs: 12, md: 2 }}>
          <MethodSelect value={method} onChange={setMethod} />
        </Grid>

        <Grid sx={{ flexGrow: 1, position: 'relative' }}>
          <WithVariables value={url} onChange={setUrl} showHighlight={true}>
            <TextField
              id="endpoint-url"
              label={t('Endpoint URL')}
              placeholder="https://jsonplaceholder.typicode.com/posts/1"
              fullWidth
              sx={{ backgroundColor: 'var(--mui-palette-background-paper)' }}
              size="small"
            />
          </WithVariables>
        </Grid>

        <Grid sx={{ xs: 12, md: 2 }}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              onClick={sendRequest}
              loading={loading}
              type="submit"
              disabled={!url || loading}
            >
              {t(`Send`)}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RequestForm;
