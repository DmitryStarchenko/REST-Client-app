'use client';

import { Box, Divider } from '@mui/material';

import { ReadonlyFC, RequestBuilderFormProps } from '@/types';
import { uid } from '@/utils';

import BodyBlock from './BodySection';
import RequestForm from './EndpointSection';
import HeadersBlock from './HeadersSection';
import VariablesSection from './VariablesSection';

const RequestBuilderForm: ReadonlyFC<RequestBuilderFormProps> = ({
  method,
  setMethod,
  url,
  setUrl,
  headers,
  setHeaders,
  body = '',
  setBody,
  loading,
  onSubmit,
  variables,
}) => {
  const handleSend = (): void => {
    onSubmit();
  };

  return (
    <Box>
      <RequestForm
        method={method}
        setMethod={setMethod}
        url={url}
        setUrl={setUrl}
        sendRequest={handleSend}
        loading={loading}
      />
      <Divider sx={{ my: 2 }} />
      <HeadersBlock
        headers={headers.length ? headers : [{ key: '', value: '', id: uid() }]}
        setHeaders={setHeaders}
      />
      <Divider sx={{ my: 2 }} />
      <VariablesSection variables={variables} />
      <Divider sx={{ my: 2 }} />
      {method !== 'GET' && <BodyBlock bodyText={body} setBodyText={setBody} />}
    </Box>
  );
};

export default RequestBuilderForm;
