import axios from 'axios';

import { getValidatedClientSession } from '@/lib/supabase/session';
import { ApiResponse, BuildRestPathInput } from '@/types';
import { headersArrayToObject, buildRestPath } from '@/utils';

export async function sendRestRequest({
  method,
  url,
  headers,
  body,
}: BuildRestPathInput): Promise<ApiResponse> {
  const bodyForPath = body && body.trim() !== '' ? body : undefined;

  const pathObj = buildRestPath({ method, url, headers, body: bodyForPath });
  window.history.replaceState(null, '', pathObj.path);

  const start = performance.now();

  const session = await getValidatedClientSession();
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
    return {
      ...data,
      durationMs: Math.round(durationMs),
      requestSize: requestSizeBytes,
      responseSize: responseSizeBytes,
      timestamp,
    };
  }

  return {
    ...data,
    timestamp,
    durationMs: Math.round(durationMs),
    requestSize: requestSizeBytes,
    responseSize: responseSizeBytes,
    status: data.status ?? 400,
    statusText: data.statusText ?? 'Bad Request',
    headers: data.headers ?? {},
  };
}
