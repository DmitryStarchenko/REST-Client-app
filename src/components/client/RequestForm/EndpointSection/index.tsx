'use client';

import { Grid, Select, MenuItem, TextField, Button, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';

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
        <TextField
          id="endpoint-url"
          label={t('Endpoint URL')}
          placeholder="https://jsonplaceholder.typicode.com/posts/1"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
          size="small"
        />
      </Grid>

      <Grid sx={{ xs: 12, md: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={sendRequest} loading={loading}>
            {t(`Send`)}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default RequestForm;
