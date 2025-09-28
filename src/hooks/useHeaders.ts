import { useCallback } from 'react';

import { Header, UseHeadersReturn } from '@/types';
import { uid } from '@/utils';

export const useHeaders = (
  headers: Header[],
  setHeaders: (headers: Header[]) => void,
): UseHeadersReturn => {
  const handleHeaderChange = useCallback(
    (id: string, key: string, value: string): void => {
      const newHeaders = headers.map((h) => (h.id === id ? { ...h, key, value } : h));

      const last = newHeaders[newHeaders.length - 1];
      if (last.key !== '' || last.value !== '') {
        newHeaders.push({ key: '', value: '', id: uid() });
      }
      setHeaders(newHeaders);
    },
    [headers, setHeaders],
  );

  const handleHeaderRemove = useCallback(
    (id: string): void => {
      if (headers.length <= 1) {
        return;
      }
      const newHeaders = headers.filter((h) => h.id !== id);
      setHeaders(newHeaders);
    },
    [headers, setHeaders],
  );

  return {
    handleHeaderChange,
    handleHeaderRemove,
  };
};
