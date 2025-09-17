import { BuildRestPathInput, Header } from '@/types';

import { decodeBase64 } from './base64';
import { uid } from './uid';

export function parseRestPath(path: string): BuildRestPathInput {
  const cleanPath = path.replace(/^\/client\//, '');

  const [mainPart, queryString = ''] = cleanPath.split('#');

  const [methodPart, urlB64 = '', bodyB64] = mainPart.split('/');

  const method = decodeURIComponent(methodPart || 'GET');
  const url = urlB64 ? decodeBase64(urlB64) : '';
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

// import { BuildRestPathInput, Header } from '@/types';

// import { decodeBase64 } from './base64';
// import { uid } from './uid';

// export function parseRestPath(path: string): BuildRestPathInput {
//   const cleanPath = path.replace(/^\/client\//, '');
//   const [methodPart, urlB64 = '', bodyB64] = cleanPath.split(/[/?]/);

//   const method = decodeURIComponent(methodPart || 'GET');
//   const url = decodeBase64(urlB64);
//   const body = bodyB64 ? decodeBase64(bodyB64) : undefined;

//   const queryIndex = path.indexOf('?');
//   const queryString = queryIndex >= 0 ? path.slice(queryIndex + 1) : '';

//   const headers: Header[] = [];
//   if (queryString) {
//     const params = new URLSearchParams(queryString);
//     params.forEach((value, key) => {
//       headers.push({
//         key,
//         value,
//         id: uid(),
//       });
//     });
//   }

//   return { method, url, body, headers };
// }
