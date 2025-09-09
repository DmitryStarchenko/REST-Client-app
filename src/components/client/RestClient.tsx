'use client';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { ApiResponse, ReadonlyFC } from '@/types';
import { buildRestPath, encodeBase64, isJson, isSuccess, parseRestPath, uid } from '@/utils';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] as const;

type HeaderItem = { key: string; value: string; id: string };

const RestClient: ReadonlyFC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams() as { method?: string; url?: string; body?: string } | null;
  const searchParams = useSearchParams();

  const [method, setMethod] = useState<string>('GET');
  const [url, setUrl] = useState<string>('');
  const [bodyText, setBodyText] = useState<string>('');
  const [headers, setHeaders] = useState<HeaderItem[]>([]);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [genCode, setGenCode] = useState<Record<string, string> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const searchParamsString = searchParams?.toString() ?? '';

  useEffect(() => {
    try {
      const parsed = parseRestPath({
        method: params?.method,
        url: params?.url,
        body: params?.body,
        searchParams: searchParamsString ? new URLSearchParams(searchParamsString) : null,
      });
      setMethod(parsed.method);
      setUrl(parsed.url || '');
      setBodyText(parsed.body || '');
      const initialHeaders = Object.entries(parsed.headers).map(([k, v]) => ({
        key: k,
        value: v,
        id: uid(),
      }));
      setHeaders(initialHeaders.length ? initialHeaders : [{ key: '', value: '', id: uid() }]);
    } catch (e) {
      console.error('parseRestPath failed', e);
    }
  }, [pathname, params?.body, params?.method, params?.url, searchParamsString]);

  const syncRoute = useCallback(
    (opts?: { push?: boolean }) => {
      const hdrs: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.key) {
          hdrs[h.key] = h.value;
        }
      });
      const path = buildRestPath({
        method,
        url,
        body: bodyText || undefined,
        headers: hdrs,
      });
      if (opts?.push) {
        router.push(`/client${path.path}`);
      } else {
        router.replace(`/client${path.path}`);
      }
    },
    [method, url, bodyText, headers, router],
  );

  useEffect(() => {
    syncRoute({ push: false });
  }, [method, syncRoute]);

  const addHeader = (): void => setHeaders((s) => [...s, { key: '', value: '', id: uid() }]);
  const removeHeader = (id: string): void => setHeaders((s) => s.filter((h) => h.id !== id));
  const updateHeader = (id: string, key: string, value: string): void =>
    setHeaders((s) => s.map((h) => (h.id === id ? { ...h, key, value } : h)));

  const tryPretty = (text: string): string => {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return text;
    }
  };

  const sendRequest = async (): Promise<void> => {
    setErrorMessage(null);
    setResponse(null);
    setLoading(true);

    try {
      const replaceBody = bodyText; //TODO: variable replacement

      const headersObj: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.key) {
          headersObj[h.key] = h.value;
        }
      });

      const result = await axios.post('/api/proxy', {
        url,
        method,
        headers: headersObj,
        body: replaceBody
          ? isJson(replaceBody)
            ? JSON.parse(replaceBody)
            : replaceBody
          : undefined,
      });

      if (result?.data) {
        setResponse(result.data);
      } else {
        setResponse({ ok: false, error: 'Empty response' });
      }

      syncRoute({ push: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown request error';
      setErrorMessage(message);
      setResponse({ ok: false, error: message });
    } finally {
      setLoading(false);
    }
  };

  const generateCode = useCallback(async () => {
    setGenCode(null);
    try {
      const [{ default: HTTPSnippet }, { default: _codegen }] = await Promise.all([
        import('httpsnippet'),
        import('postman-code-generators'),
      ]);

      const headersArr = headers.filter((h) => h.key).map((h) => ({ name: h.key, value: h.value }));

      const snippetInput = {
        method,
        url,
        httpVersion: '1.1',
        headers: headersArr,
        postData: isJson(bodyText)
          ? { mimeType: 'application/json', text: bodyText }
          : bodyText
            ? { mimeType: 'application/plain', text: bodyText }
            : undefined,
      };
      const sn = new HTTPSnippet(snippetInput);

      const outputs: Record<string, string> = {
        curl: sn.convert('shell', 'curl') ?? '',
        fetch: sn.convert('javascript', 'fetch') ?? '',
        node: sn.convert('node', 'request') ?? '',
        python: sn.convert('python', 'python-requests') ?? '',
      };
      setGenCode(outputs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setGenCode({ error: 'Codegen failed: ' + (message || String(err)) });
    }
  }, [method, url, headers, bodyText]);

  return (
    <Box p={2}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6">REST Client</Typography>

        <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
          <Grid sx={{ xs: 12, md: 2 }}>
            <Select
              value={method}
              onChange={(e) => setMethod(String(e.target.value))}
              fullWidth
              size="small"
            >
              {METHODS.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid sx={{ xs: 12, md: 8 }}>
            <TextField
              label="Endpoint URL"
              placeholder="https://jsonplaceholder.typicode.com/posts/1"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => syncRoute({ push: false })}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid sx={{ xs: 12, md: 2 }}>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={sendRequest} disabled={loading}>
                {loading ? 'Sending…' : 'Send'}
              </Button>
              <Button onClick={() => syncRoute({ push: true })}>Update URL</Button>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Headers editor */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1">Headers</Typography>
            <IconButton size="small" onClick={addHeader} aria-label="add header">
              <AddIcon />
            </IconButton>
          </Stack>

          <Stack spacing={1} sx={{ mt: 1 }}>
            {headers.map((h) => (
              <Stack direction="row" spacing={1} key={h.id}>
                <TextField
                  placeholder="Header name"
                  value={h.key}
                  onChange={(e) => updateHeader(h.id, e.target.value, h.value)}
                  size="small"
                />
                <TextField
                  placeholder="Header value"
                  value={h.value}
                  onChange={(e) => updateHeader(h.id, h.key, e.target.value)}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <IconButton
                  onClick={() => removeHeader(h.id)}
                  aria-label="remove header"
                  size="small"
                >
                  <RemoveIcon />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Body editor (show for non-GET methods) */}
        {method !== 'GET' && (
          <Box>
            <Typography variant="subtitle1">Body</Typography>
            <TextField
              placeholder='{"title":"foo","body":"bar"}'
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              onBlur={() => syncRoute({ push: false })}
              multiline
              minRows={6}
              fullWidth
              sx={{ mt: 1 }}
            />
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button
                onClick={() => setBodyText((s) => tryPretty(s))}
                size="small"
                variant="outlined"
              >
                Prettify
              </Button>
              <Button
                onClick={() => {
                  const encoded = encodeBase64(bodyText || '');
                  navigator.clipboard?.writeText(encoded);
                }}
                size="small"
                variant="outlined"
              >
                Copy base64(body)
              </Button>
            </Stack>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Generated code */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1">Generated code</Typography>
            <Button onClick={generateCode} size="small" variant="outlined">
              Generate
            </Button>
          </Stack>

          <Box mt={1}>
            {!genCode && <Typography color="textSecondary">No code generated yet.</Typography>}
            {genCode && (
              <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 12 }}>
                {Object.entries(genCode).map(([k, v]) => (
                  <Box key={k} sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      {k}
                    </Typography>
                    <Paper elevation={0} sx={{ p: 1, mt: 0.5 }}>
                      <code style={{ display: 'block' }}>{v}</code>
                    </Paper>
                  </Box>
                ))}
              </div>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Response */}
        <Box>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">Response</Typography>
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
          </Stack>

          <Paper sx={{ mt: 1, p: 2, background: 'var(--background-paper)' }}>
            {isSuccess(response) ? (
              <div style={{ fontFamily: 'monospace', fontSize: 13 }}>
                <div>
                  <strong>Status:</strong> {response.status} {response.statusText || ''}
                </div>
                <div style={{ marginTop: 8 }}>
                  <strong>Headers:</strong>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(response.headers || {}, null, 2)}
                  </pre>
                </div>
                <div style={{ marginTop: 8 }}>
                  <strong>Body:</strong>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>
                    {typeof response.data === 'string'
                      ? response.data
                      : JSON.stringify(response.data, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <Typography color="textSecondary">No response yet</Typography>
            )}
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
};

export default RestClient;
