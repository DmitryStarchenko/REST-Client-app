import { BuildRestPathInput, Header } from '@/types';

import { decodeBase64 } from './base64';
import { uid } from './uid';

export function parseRestPath(path: string): BuildRestPathInput {
  const cleanPath = path.replace(/^\/client\//, '');
  const [methodPart, urlB64 = '', bodyB64WithQuery = ''] = cleanPath.split('/');

  const method = decodeURIComponent(methodPart || 'GET');
  const queryIndex = bodyB64WithQuery.indexOf('?');

  const bodyB64 = queryIndex >= 0 ? bodyB64WithQuery.slice(0, queryIndex) : bodyB64WithQuery;
  const queryString = queryIndex >= 0 ? bodyB64WithQuery.slice(queryIndex + 1) : '';

  const url = decodeBase64(urlB64);
  const body = bodyB64 ? decodeBase64(bodyB64) : undefined;

  const headers: Header[] = [];
  if (queryString) {
    const params = new URLSearchParams(queryString);
    params.forEach((value, key) => {
      headers.push({
        key,
        value,
        id: uid(),
      });
    });
  }

  return { method, url, body, headers };
}
