'use client';
import { Grid, TextField, Button, Paper } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

import WithVariables from '@/components/client/Components/WithVariables';
import { ReadonlyFC, RequestFormProps } from '@/types';

import MethodSelect from './MethodSelect';
import styles from './RequestForm.module.css';

export const FormSection: ReadonlyFC<RequestFormProps> = ({
  method,
  setMethod,
  url,
  setUrl,
  sendRequest,
  loading,
}) => {
  const t = useTranslations('RequestForm');
  return (
    <Paper className={styles.paper}>
      <Grid container className={styles.gridContainer}>
        <Grid>
          <MethodSelect value={method} onChange={setMethod} />
        </Grid>

        <Grid className={styles.urlInputGrid}>
          <WithVariables value={url} onChange={setUrl} showHighlight={true}>
            <TextField
              id="endpoint-url"
              label={t('Endpoint URL')}
              placeholder="https://jsonplaceholder.typicode.com/posts/1"
              fullWidth
              className={styles.textField}
              size="small"
            />
          </WithVariables>
        </Grid>

        <Grid>
          <Button
            variant="contained"
            onClick={sendRequest}
            loading={loading}
            type="submit"
            disabled={!url || loading}
          >
            {t(`Send`)}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
