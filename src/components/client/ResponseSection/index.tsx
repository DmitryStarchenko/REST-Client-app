'use client';

import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

import { ResponseBlockProps } from '@/types';

import { CodeEditor } from '../Shared';

const ResponseBlock: React.FC<ResponseBlockProps> = ({
  response,
  errorMessage,
  unknownErrorText,
  internalErrorText,
}) => {
  const t = useTranslations('ResponseBlock');

  const getResponseContent = (): string => {
    if (!response) return t('No response yet');

    if (errorMessage) return errorMessage;

    if (response.ok) {
      return typeof response.data === 'string'
        ? response.data
        : JSON.stringify(response.data, null, 2);
    } else {
      return response.error ?? unknownErrorText;
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          mb: 2,
        }}
      >
        <Typography variant="subtitle1">{t(`Response`)}</Typography>

        {errorMessage ? (
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
            <Typography variant="body2" color="error">
              {errorMessage}
            </Typography>
            <Typography variant="body2" color="error">
              {t(`Timestamp`)}: {response?.timestamp ?? '-'}
            </Typography>
          </Stack>
        ) : (
          response && (
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
              <Typography variant="body2" color="success">
                {t(`Status`)}: {response.status ?? '-'}
              </Typography>
              <Typography variant="body2" color="success">
                {t(`StatusText`)}: {response.statusText ?? internalErrorText}
              </Typography>
              <Typography variant="body2" color="success">
                {t(`Success`)}: {String(response.ok)}
              </Typography>
              <Typography variant="body2" color="success">
                {t(`Duration`)}: {response.durationMs ?? '-'} {t(`ms`)}
              </Typography>
              <Typography variant="body2" color="success">
                {t(`Response`)}: {response.responseSize ?? '-'} {t('bytes')}
              </Typography>
              <Typography variant="body2" color="success">
                {t('Timestamp')}: {response.timestamp ?? '-'}
              </Typography>
            </Stack>
          )
        )}
      </Box>

      <CodeEditor value={getResponseContent()} height="200px" language="json" readOnly />

      {!errorMessage && response?.headers && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">{t('Headers')}</Typography>
          <CodeEditor
            value={JSON.stringify(response.headers, null, 2)}
            height="150px"
            language="json"
            readOnly
          />
        </Box>
      )}
    </>
  );
};

export default ResponseBlock;
