'use client';

import { Box, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { VARIABLES_KEY } from '@/constants';
import { usePathname } from '@/i18n/navigation';
import { ApiResponse, IVariable, ReadonlyFC, Header } from '@/types';
import { parseRestPath, sendRestRequest } from '@/utils';
import { replaceVariables } from '@/utils/variable';

import BottomTabsBlock from './BottomSection';
import RequestForm from './EndpointSection';
import TopTabsBlock from './TopSection';

const RestClient: ReadonlyFC = () => {
  const [variables] = useLocalStorage<IVariable[]>(VARIABLES_KEY, []);

  const variablesObj = variables.reduce<Record<string, string>>((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {});

  const t = useTranslations('RestClient');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const initialData = useMemo(() => parseRestPath(fullPath), [fullPath]);

  const [method, setMethod] = useState(initialData.method);
  const [url, setUrl] = useState(initialData.url);
  const [body, setBody] = useState(initialData.body);
  const [headers, setHeaders] = useState<Header[]>(initialData.headers);

  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    setErrorMessage(null);
    setResponse(null);
    setLoading(true);

    try {
      const processedUrl = replaceVariables(url, variablesObj);
      const processedHeaders = headers.map((header) => ({
        ...header,
        key: replaceVariables(header.key, variablesObj),
        value: replaceVariables(header.value, variablesObj),
      }));
      const processedBody = replaceVariables(body || '', variablesObj);

      const result = await sendRestRequest({
        method,
        url: processedUrl,
        headers: processedHeaders,
        body: processedBody,
      });
      setResponse(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setErrorMessage(message);
      setResponse({
        ok: false,
        status: 500,
        statusText: 'Internal Error',
        headers: {},
        error: message,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }, [body, headers, method, url, variablesObj]);

  return (
    <Box p={2} width={1200} m="auto">
      <Typography variant="h4" mb={2} textAlign="center">
        {t('Title')}
      </Typography>
      <RequestForm
        method={method}
        setMethod={setMethod}
        url={url}
        setUrl={setUrl}
        sendRequest={handleSubmit}
        loading={loading}
        variables={variables}
        variablesObj={variablesObj}
      />

      <TopTabsBlock
        headers={headers}
        setHeaders={setHeaders}
        bodyText={body}
        setBodyText={setBody}
        method={method}
        url={url}
        variables={variables}
        variablesObj={variablesObj}
      />

      <BottomTabsBlock
        response={response}
        errorMessage={errorMessage}
        unknownErrorText={t('UError')}
        internalErrorText={t('IError')}
      />
    </Box>
  );
};

export default RestClient;
