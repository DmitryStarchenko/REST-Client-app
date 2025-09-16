'use client';

import { Box, Divider } from '@mui/material';

import { ReadonlyFC, RequestBuilderFormProps } from '@/types';
import { uid } from '@/utils';

import BodyBlock from './BodySection';
import RequestForm from './EndpointSection';
import HeadersBlock from './HeadersSection';

const RequestBuilderForm: ReadonlyFC<RequestBuilderFormProps> = ({
  method,
  url,
  headers,
  body = '',
  loading = false,
  onChange,
  onSubmit,
}) => {
  const handleSend = (): void => {
    onSubmit({ method, url, headers, body: body || undefined });
  };

  return (
    <Box>
      <RequestForm
        method={method}
        setMethod={(m) => onChange({ method: m, url, headers, body })}
        url={url}
        setUrl={(u) => onChange({ method, url: u, headers, body })}
        sendRequest={handleSend}
        loading={loading}
      />
      <Divider sx={{ my: 2 }} />
      <HeadersBlock
        headers={headers.length ? headers : [{ key: '', value: '', id: uid() }]}
        setHeaders={(h) => onChange({ method, url, headers: h, body })}
      />
      <Divider sx={{ my: 2 }} />
      {method !== 'GET' && (
        <BodyBlock
          bodyText={body}
          setBodyText={(b) => onChange({ method, url, headers, body: b })}
        />
      )}
    </Box>
  );
};

export default RequestBuilderForm;
