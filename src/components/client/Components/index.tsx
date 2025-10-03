'use client';

import { SwapVert, SwapHoriz } from '@mui/icons-material';
import { Box, Typography, Fab } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import React from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { VARIABLES_KEY } from '@/constants';
import { usePathname } from '@/i18n/navigation';
import { ApiResponse, IVariable, ReadonlyFC, Header } from '@/types';
import { parseRestPath } from '@/utils/parseRestPath';
import { sendRestRequest } from '@/utils/sendRestRequest';
import { replaceVariables } from '@/utils/variable';

import { FormSection } from './FormSection';
import { RequestSection } from './RequestSection';
import { ResponseSection } from './ResponseSection';

const fadeVariants = {
  enter: {
    opacity: 0,
    scale: 0.9,
  },
  center: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.3,
    },
  },
};

const RestClient: ReadonlyFC = () => {
  const [variables] = useLocalStorage<IVariable[]>(VARIABLES_KEY, []);
  const [activeSection, setActiveSection] = useState<'request' | 'response'>('request');
  const [direction, setDirection] = useState(0);

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

      setTimeout(() => {
        setDirection(1);
        setActiveSection('response');
      }, 300);
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
      setTimeout(() => {
        setDirection(1);
        setActiveSection('response');
      }, 300);
    } finally {
      setLoading(false);
    }
  }, [body, headers, method, url, variablesObj]);

  const toggleSection = (): void => {
    if (activeSection === 'request') {
      setDirection(1);
      setActiveSection('response');
    } else {
      setDirection(-1);
      setActiveSection('request');
    }
  };

  const canShowResponse = response || errorMessage;

  return (
    <Box sx={{ maxWidth: '1200', m: 'auto', p: 2, width: '100%', position: 'relative' }}>
      <Typography variant="h4" mb={2} textAlign="center">
        {t('Title')}
      </Typography>

      <Fab
        color="primary"
        onClick={toggleSection}
        disabled={activeSection === 'response' && !canShowResponse}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
        size="medium"
      >
        {activeSection === 'request' ? <SwapVert /> : <SwapHoriz />}
      </Fab>

      <form onSubmit={handleSubmit}>
        <FormSection
          method={method}
          setMethod={setMethod}
          url={url}
          setUrl={setUrl}
          sendRequest={handleSubmit}
          loading={loading}
          variables={variables}
          variablesObj={variablesObj}
        />

        <Box sx={{ position: 'relative', height: '500px', overflow: 'hidden', mt: 2 }}>
          <AnimatePresence mode="wait" custom={direction}>
            {activeSection === 'request' ? (
              <motion.div
                key="request"
                custom={direction}
                variants={fadeVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ position: 'absolute', width: '100%', height: '100%' }}
              >
                <RequestSection
                  headers={headers}
                  setHeaders={setHeaders}
                  bodyText={body}
                  setBodyText={setBody}
                  method={method}
                  url={url}
                  variables={variables}
                  variablesObj={variablesObj}
                />
              </motion.div>
            ) : (
              <motion.div
                key="response"
                custom={direction}
                variants={fadeVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ position: 'absolute', width: '100%', height: '100%' }}
              >
                <ResponseSection
                  response={response}
                  errorMessage={errorMessage}
                  unknownErrorText={t('UError')}
                  internalErrorText={t('IError')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </form>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            bgcolor: activeSection === 'request' ? 'primary.main' : 'grey.400',
            cursor: 'pointer',
          }}
          onClick={() => {
            setDirection(-1);
            setActiveSection('request');
          }}
        />
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            bgcolor: activeSection === 'response' ? 'primary.main' : 'grey.400',
            cursor: canShowResponse ? 'pointer' : 'default',
            opacity: canShowResponse ? 1 : 0.5,
          }}
          onClick={() => {
            if (canShowResponse) {
              setDirection(1);
              setActiveSection('response');
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default RestClient;
