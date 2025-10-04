'use client';

import { useCallback } from 'react';

import { CodeGenOutputs, UseCodeGenReturn } from '@/types';
import { generateSnippet } from '@/utils';
import { isJson } from '@/utils';

export function useCodegen(
  method: string,
  url: string,
  headers: { key: string; value: string }[],
  body?: string,
): UseCodeGenReturn {
  const generateForLang = useCallback(
    async (lang: string): Promise<string> => {
      try {
        const [{ default: HTTPSnippet }] = await Promise.all([import('httpsnippet')]);

        const headersArr = headers
          .filter((h) => h.key)
          .map((h) => ({ name: h.key, value: h.value }));

        let postData;

        if (body && isJson(body)) {
          postData = { mimeType: 'application/json', text: body };
        } else if (body) {
          postData = { mimeType: 'text/plain', text: body };
        } else {
          postData = undefined;
        }

        const snippetInput = {
          method,
          url,
          httpVersion: '1.1',
          headers: headersArr,
          postData,
        };

        const sn = new HTTPSnippet(snippetInput);
        const outputs: CodeGenOutputs = generateSnippet(sn);

        if (!(lang in outputs)) {
          throw new Error(`Language ${lang} not supported`);
        }

        return outputs[lang];
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        throw new Error('Codegen failed: ' + message);
      }
    },
    [method, url, headers, body],
  );

  return { generateForLang };
}
