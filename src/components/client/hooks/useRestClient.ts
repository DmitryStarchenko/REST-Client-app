'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { VARIABLES_KEY } from '@/constants';
import { usePathname } from '@/i18n/navigation';
import { ApiResponse, IVariable, Header } from '@/types';
import { parseRestPath } from '@/utils/parseRestPath';
import { sendRestRequest } from '@/utils/sendRestRequest';
import { replaceVariables } from '@/utils/variable';

import { ActiveSection, UseRestClientReturn } from '../types';

export const useRestClient = (): UseRestClientReturn => {
  const [variables] = useLocalStorage<IVariable[]>(VARIABLES_KEY, []);
  const [activeSection, setActiveSection] = useState<ActiveSection>('Request');
  const [direction, setDirection] = useState<number>(0);

  const variablesObj = useMemo(
    (): Record<string, string> =>
      variables.reduce<Record<string, string>>((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {}),
    [variables],
  );

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const initialData = useMemo(() => parseRestPath(fullPath), [fullPath]);

  const [method, setMethod] = useState<string>(initialData.method);
  const [url, setUrl] = useState<string>(initialData.url);
  const [body, setBody] = useState<string>(initialData.body || '');
  const [headers, setHeaders] = useState<Header[]>(initialData.headers);

  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async (): Promise<void> => {
    setErrorMessage(null);
    setResponse(null);
    setLoading(true);

    try {
      const processedUrl: string = replaceVariables(url, variablesObj);
      const processedHeaders: Header[] = headers.map((header) => ({
        ...header,
        key: replaceVariables(header.key, variablesObj),
        value: replaceVariables(header.value, variablesObj),
      }));
      const processedBody: string = replaceVariables(body, variablesObj);

      const result: ApiResponse = await sendRestRequest({
        method,
        url: processedUrl,
        headers: processedHeaders,
        body: processedBody,
      });
      setResponse(result);

      setTimeout(() => {
        setDirection(1);
        setActiveSection('Response');
      }, 200);
    } catch (e: unknown) {
      const message: string = e instanceof Error ? e.message : 'Unknown error';
      setErrorMessage(message);
      setResponse({
        ok: false,
        status: 500,
        statusText: 'Internal Error',
        headers: {},
        error: message,
        timestamp: new Date().toISOString(),
      });
      setTimeout(() => {
        setDirection(1);
        setActiveSection('Response');
      }, 200);
    } finally {
      setLoading(false);
    }
  }, [body, headers, method, url, variablesObj]);

  const toggleSection = useCallback((): void => {
    if (activeSection === 'Request') {
      setDirection(1);
      setActiveSection('Response');
    } else {
      setDirection(-1);
      setActiveSection('Request');
    }
  }, [activeSection]);

  return {
    method,
    url,
    body,
    headers,
    response,
    errorMessage,
    loading,
    activeSection,
    direction,
    variables,
    variablesObj,

    setMethod,
    setUrl,
    setBody,
    setHeaders,
    handleSubmit,
    toggleSection,
    setActiveSection,
    setDirection,
  };
};
