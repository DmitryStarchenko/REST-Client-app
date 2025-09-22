import { BuildRestPathInput, ParseRestPathResult } from '@/types';

import { encodeBase64 } from './base64';

export function buildRestPath({
  method,
  url,
  body,
  headers,
}: BuildRestPathInput): ParseRestPathResult {
  const methodPart = encodeURIComponent(method.toUpperCase());
  const urlB64 = encodeBase64(url || '');
  const bodyPart = body ? '/' + encodeBase64(body) : '';

  const params = new URLSearchParams();

  headers
    .filter((h) => h.key.trim() !== '' && h.value.trim() !== '')
    .forEach((h) => {
      params.append(h.key, h.value);
    });
  const query = params.toString();
  const path = `/client/${methodPart}/${urlB64}${bodyPart}${query ? `?${query}` : ''}`;
  return {
    path,
    method: methodPart,
    urlB64,
    bodyB64: body ? encodeBase64(body) : undefined,
    query,
  };
}
