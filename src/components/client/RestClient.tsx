'use client';

import { Box, Divider, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { useCallback, useState } from 'react';

import { usePathname } from '@/i18n/navigation';
import supabaseClient from '@/lib/supabase/client';
import { ApiResponse, Header, ReadonlyFC } from '@/types';
import { headersArrayToObject, parseRestPath, buildRestPath } from '@/utils';

import CodeGenSection from './CodegenSection';
import RequestBuilderForm from './RequestForm';
import ResponseBlock from './ResponseSection';

const RestClient: ReadonlyFC = () => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const pathWithoutLocale = pathname.replace(`/${locale}`, '');

  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fullPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const [request, setRequest] = useState(() => parseRestPath(fullPath));

  const handleChange = useCallback(
    (data: { method: string; url: string; headers: Header[]; body?: string }) => {
      setRequest(data);
      const pathObj = buildRestPath(data);
      window.history.replaceState(null, '', pathObj.path);
    },
    [],
  );

  const sendRequest = useCallback(async () => {
    setErrorMessage(null);
    setResponse(null);
    setLoading(true);

    const { method, url, headers, body } = data;
    const bodyForPath = body && body.trim() !== '' ? body : undefined;

    const start = performance.now();

    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      const accessToken = session?.access_token ?? null;

      const headersObj = headersArrayToObject(headers);

      const response = await axios.post<ApiResponse>('/api/proxy', {
        url,
        method,
        headers: headersObj,
        body,
        access_token: accessToken,
      });

      const durationMs = performance.now() - start;
      const timestamp = new Date().toISOString();
      const data = response.data;

      const requestSizeBytes = bodyForPath ? new Blob([bodyForPath]).size : 0;
      let responseSizeBytes = 0;
      if (data && 'data' in data) {
        const respStr = typeof data.data === 'string' ? data.data : JSON.stringify(data.data);
        responseSizeBytes = new Blob([respStr]).size;
      } else if (data && 'error' in data) {
        responseSizeBytes = new Blob([data.error]).size;
      }

      if (data.ok) {
        setResponse({
          ...data,
          durationMs: Math.round(durationMs),
          requestSize: requestSizeBytes,
          responseSize: responseSizeBytes,
          timestamp,
        });
      } else {
        setResponse({
          ...data,
          timestamp,
          durationMs: Math.round(durationMs),
          requestSize: requestSizeBytes,
          responseSize: responseSizeBytes,
          status: data.status ?? 400,
          statusText: data.statusText ?? 'Bad Request',
          headers: data.headers ?? {},
        });
      }
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
  }, []);

  return (
    <Box p={2}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6">REST Client</Typography>

        <RequestBuilderForm
          method={request.method}
          url={request.url}
          body={request.body}
          headers={request.headers}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />

        <Divider sx={{ my: 2 }} />
        <CodeGenSection
          method={request.method}
          url={request.url}
          headers={request.headers}
          body={request.body}
        />
        <Divider sx={{ my: 2 }} />
        <ResponseBlock response={response} errorMessage={errorMessage} />
      </Paper>
    </Box>
  );
};

export default RestClient;
