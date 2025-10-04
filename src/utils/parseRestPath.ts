'use client';
import { BuildRestPathInput, Header } from '@/types';

import { decodeBase64 } from './base64';
import { uid } from './uid';

export const parseRestPath = (path: string): BuildRestPathInput => {
  const idx = path.indexOf('/client/');
  const cleanPath = idx >= 0 ? path.slice(idx + '/client/'.length) : '';

  const [mainPart, queryString = ''] = cleanPath.split('?');

  const [methodPart, urlB64 = '', bodyB64] = mainPart.split('/');

  const method = decodeURIComponent(methodPart || 'GET');
  const url = urlB64 ? decodeBase64(urlB64) : '';
  const body = bodyB64 ? decodeBase64(bodyB64) : '';

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
};
