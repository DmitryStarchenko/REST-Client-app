'use client';

import { useCallback } from 'react';

import { CodeGenOutputs, UseCodeGenReturn } from '@/types';
import { generateOutputs } from '@/utils';
import { isJson } from '@/utils';

export function useCodegen(
  method: string,
  url: string,
  headers: { key: string; value: string }[],
  bodyText: string,
): UseCodeGenReturn {
  const generateForLang = useCallback(
    async (lang: string): Promise<string> => {
      try {
        const [{ default: HTTPSnippet }] = await Promise.all([import('httpsnippet')]);

        const headersArr = headers
          .filter((h) => h.key)
          .map((h) => ({ name: h.key, value: h.value }));

        const snippetInput = {
          method,
          url,
          httpVersion: '1.1',
          headers: headersArr,
          postData: isJson(bodyText)
            ? { mimeType: 'application/json', text: bodyText }
            : bodyText
              ? { mimeType: 'text/plain', text: bodyText }
              : undefined,
        };

        const sn = new HTTPSnippet(snippetInput);
        const outputs: CodeGenOutputs = generateOutputs(sn);

        if (!(lang in outputs)) {
          throw new Error(`Language ${lang} not supported`);
        }

        return outputs[lang];
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        throw new Error('Codegen failed: ' + message);
      }
    },
    [method, url, headers, bodyText],
  );

  return { generateForLang };
}
