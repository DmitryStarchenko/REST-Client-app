'use client';

import { Box, Divider, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { useAtom, useAtomValue } from 'jotai';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { VARIABLES_KEY } from '@/constants';
import { useRouter } from '@/i18n';
import supabaseClient from '@/lib/supabase/client';
import { bodyAtom, themeAtom, headersAtom, methodAtom, responseAtom, urlAtom } from '@/store';
import { ApiResponse, IVariable, ReadonlyFC } from '@/types';
import { buildRestPath } from '@/utils/restClientPathRouting';
import { replaceVariables } from '@/utils/variable';

import BodyBlock from './BodySection';
import CodeGenSection from './CodegenSection';
import HeadersBlock from './HeadersSection';
import RequestForm from './RequestForm';
import ResponseBlock from './ResponseSection';
import SavedVariables from './SavedVariables/SavedVariables';

const RestClient: ReadonlyFC = () => {
  const router = useRouter();
  const editorTheme = useAtomValue(themeAtom);

  const [variables] = useLocalStorage<IVariable[]>(VARIABLES_KEY, []);

  const variablesObj = variables.reduce<Record<string, string>>((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {});

  const [url, setUrl] = useAtom(urlAtom);
  const [method, setMethod] = useAtom(methodAtom);
  const [bodyText, setBodyText] = useAtom(bodyAtom);
  const [headers, setHeaders] = useAtom(headersAtom);
  const [response, setResponse] = useAtom(responseAtom);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const lastPathRef = useRef('');

  useEffect(() => {
    const hdrs: Record<string, string> = {};
    headers.forEach((h) => {
      if (h.key) hdrs[h.key] = h.value;
    });

    const pathObj = buildRestPath({
      method,
      url,
      body: bodyText || undefined,
      headers: hdrs,
    });

    if (lastPathRef.current === pathObj.path) return;
    lastPathRef.current = pathObj.path;
  }, [bodyText, headers, method, router, url]);

  const sendRequest = useCallback(async () => {
    setErrorMessage(null);
    setResponse(null);
    setLoading(true);

    const headersObj: Record<string, string> = {};
    const headersObjParsed: Record<string, string> = {};
    headers.forEach((h) => {
      if (h.key) {
        headersObj[h.key] = h.value;
        headersObjParsed[h.key] = replaceVariables(h.value, variablesObj);
      }
    });

    const bodyForPath = bodyText && bodyText.trim() !== '' ? bodyText : undefined;

    const parsedUrl = replaceVariables(url, variablesObj);
    const parsedBody = bodyForPath ? replaceVariables(bodyForPath, variablesObj) : undefined;

    const pathObj = buildRestPath({
      method,
      url: parsedUrl,
      body: parsedBody,
      headers: headersObjParsed,
    });
    // replace path to URL without browser history
    try {
      router.replace(`/${pathObj.path}`);
    } catch {
      // in some environments router.replace may be sync/async
    }

    const start = performance.now();

    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      const accessToken = session?.access_token ?? null;
      // parse body to JS if it's JSON text
      let parsedJsonBody: unknown = undefined;
      if (parsedBody) {
        try {
          parsedJsonBody = JSON.parse(parsedBody);
        } catch {
          parsedJsonBody = parsedBody;
        }
      }

      const result = await axios.post<ApiResponse>('/api/proxy', {
        url: parsedUrl,
        method,
        headers: headersObjParsed,
        body: parsedJsonBody,
        access_token: accessToken,
      });

      const durationMs = performance.now() - start;
      const data = result.data;
      setResponse(data);

      // Calculate request/response sizes:
      const requestSizeBytes = bodyForPath ? new Blob([bodyForPath]).size : 0;
      let responseSizeBytes = 0;
      if (data && 'data' in data) {
        const respStr = typeof data.data === 'string' ? data.data : JSON.stringify(data.data);
        responseSizeBytes = new Blob([respStr]).size;
      } else if (data && 'error' in data) {
        responseSizeBytes = new Blob([data.error]).size;
      }

      // HISTORY:for the client side
      try {
        const {
          data: { user },
        } = await supabaseClient.auth.getUser();
        const userId = user?.id ?? null;

        await supabaseClient.from('request_history').insert({
          user_id: userId,
          method,
          url,
          headers: JSON.stringify(headersObj),
          body: bodyForPath ?? null,
          response_status: 'status' in data ? data.status : null,
          response_data: 'data' in data ? JSON.stringify(data.data ?? null) : data.error,
          duration_ms: Math.round(durationMs),
          request_size: requestSizeBytes,
          response_size: responseSizeBytes,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        // ignore client-side history failure — proxy already tries to save server-side
        console.warn('Optional client-side history save failed', err);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setErrorMessage(message);
      setResponse({ ok: false, error: message });
    } finally {
      setLoading(false);
    }
  }, [setResponse, headers, bodyText, method, url, router, variablesObj]);

  return (
    <Box p={2}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6">REST Client</Typography>
        {/* Method + Endpoint + Send */}
        <RequestForm
          method={method}
          setMethod={setMethod}
          url={url}
          setUrl={setUrl}
          sendRequest={sendRequest}
          loading={loading}
        />
        <Divider sx={{ my: 2 }} />
        {/* Headers */}
        <HeadersBlock headers={headers} setHeaders={setHeaders} />
        <Divider sx={{ my: 2 }} />
        {/* Body */}
        {method !== 'GET' && (
          <BodyBlock bodyText={bodyText} setBodyText={setBodyText} theme={editorTheme} />
        )}
        <Divider sx={{ my: 2 }} />

        <SavedVariables variables={variables} />
        <Divider sx={{ my: 2 }} />
        {/* Code generation */}
        <CodeGenSection method={method} url={url} headers={headers} bodyText={bodyText} />
        <Divider sx={{ my: 2 }} />
        {/* Response */}
        <ResponseBlock response={response} errorMessage={errorMessage} theme={editorTheme} />
      </Paper>
    </Box>
  );
};

export default RestClient;
