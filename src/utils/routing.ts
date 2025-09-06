import {
  BuildRestPathOptions,
  BuildRestPathResult,
  ParseRestPathParams,
  ParseRestPathResult,
} from '@/types';

import { encodeBase64, decodeBase64 } from './base64';

export const buildRestPath = (opts: Readonly<BuildRestPathOptions>): BuildRestPathResult => {
  const method = (opts.method || 'GET').toUpperCase();
  const encodedUrl = encodeBase64(opts.url || '');
  const encodedBody = opts.body ? encodeBase64(opts.body) : undefined;

  let path = `/${method}/${encodedUrl}`;
  if (encodedBody) {
    path += `/${encodedBody}`;
  }

  const qs = opts.headers
    ? Object.entries(opts.headers)
        .filter(([k, v]) => k && v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&')
    : '';

  if (qs) {
    path += `?${qs}`;
  }
  return { path };
};

export const parseRestPath = (params: Readonly<ParseRestPathParams>): ParseRestPathResult => {
  const method = (params.method || 'GET').toUpperCase();
  const url = params.url ? decodeBase64(params.url) : '';
  const body = params.body ? decodeBase64(params.body) : '';
  const headers: Record<string, string> = {};
  if (params.searchParams) {
    params.searchParams.forEach((value, key) => {
      headers[key] = value;
    });
  }
  return { method, url, body, headers };
};
