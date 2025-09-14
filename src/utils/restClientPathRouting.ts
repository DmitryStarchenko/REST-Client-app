import { BuildRestPathInput, ParseRestPathResult } from '@/types';

export function encodeBase64(input: string): string {
  try {
    return btoa(unescape(encodeURIComponent(input)));
  } catch {
    return Buffer.from(input, 'utf8').toString('base64');
  }
}

export function buildRestPath({
  method,
  url,
  body,
  headers = {},
}: BuildRestPathInput): ParseRestPathResult {
  const methodPart = encodeURIComponent(method.toUpperCase());
  const urlB64 = encodeBase64(url || '');
  const bodyPart = body ? '/' + encodeBase64(body) : '';
  // Build headers query string, skip empty keys
  const params = new URLSearchParams();
  Object.entries(headers).forEach(([k, v]) => {
    if (k && v != null) params.append(k, encodeURIComponent(String(v)));
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
