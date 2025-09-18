'use client';

import { Box, Divider, Paper, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { usePathname } from '@/i18n/navigation';
import { ApiResponse, Header, ReadonlyFC } from '@/types';
import { parseRestPath, sendRestRequest } from '@/utils';

import CodeGenSection from './CodegenSection';
import RequestBuilderForm from './RequestForm';
import ResponseBlock from './ResponseSection';

const RestClient: ReadonlyFC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const initialData = useMemo(() => parseRestPath(fullPath), [fullPath]);
  const [method, setMethod] = useState(initialData.method);
  const [url, setUrl] = useState(initialData.url);
  const [body, setBody] = useState(initialData.body);
  const [headers, setHeaders] = useState<Header[]>(initialData.headers);

  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    setErrorMessage(null);
    setResponse(null);
    setLoading(true);

    try {
      const result = await sendRestRequest({ method, url, headers, body });
      setResponse(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setErrorMessage(message);
      setResponse({
        ok: false,
        status: 500,
        statusText: 'Internal Error',
        headers: {},
        error: message,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }, [body, headers, method, url]);

  return (
    <Box p={2}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6">REST Client</Typography>

        <RequestBuilderForm
          method={method}
          setMethod={setMethod}
          url={url}
          setUrl={setUrl}
          headers={headers}
          setHeaders={setHeaders}
          body={body}
          setBody={setBody}
          onSubmit={handleSubmit}
          loading={loading}
        />

        <Divider sx={{ my: 2 }} />
        <CodeGenSection method={method} url={url} headers={headers} body={body} />
        <Divider sx={{ my: 2 }} />
        <ResponseBlock response={response} errorMessage={errorMessage} />
      </Paper>
    </Box>
  );
};

export default RestClient;
