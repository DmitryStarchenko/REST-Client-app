'use client';

import { Grid, Select, MenuItem, TextField, Button, Stack } from '@mui/material';

import { METHODS } from '@/constants';
import { ReadonlyFC } from '@/types';

interface RequestFormProps {
  method: string;
  setMethod: (method: string) => void;
  url: string;
  setUrl: (url: string) => void;
  sendRequest: () => void;
  loading: boolean;
}

const RequestForm: ReadonlyFC<RequestFormProps> = ({
  method,
  setMethod,
  url,
  setUrl,
  sendRequest,
  loading,
}) => {
  return (
    <Grid container spacing={0.1} alignItems="center" sx={{ mt: 1.5, display: 'flex' }}>
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

      <Grid sx={{ flexGrow: 1 }}>
        <TextField
          id="endpoint-url"
          label="Endpoint URL"
          placeholder="https://jsonplaceholder.typicode.com/posts/1"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
          size="small"
        />
      </Grid>

      <Grid sx={{ xs: 12, md: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={sendRequest} disabled={loading}>
            {loading ? 'Sending…' : 'Send'}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default RequestForm;
