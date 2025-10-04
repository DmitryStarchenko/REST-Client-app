'use client';

import { Box, Tab, Tabs, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import React from 'react';

import { BottomTabsBlockProps, ReadonlyFC } from '@/types';

import ResponseHeaders from './Headers';
import ResponseBlock from './Response';
import Statistic from './Statistic';

export const ResponseSection: ReadonlyFC<BottomTabsBlockProps> = ({
  response,
  errorMessage,
  unknownErrorText,
  internalErrorText,
}) => {
  const t = useTranslations('RestClient');
  const [bottomTab, setBottomTab] = useState(0);

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1} mt={2}>
        <Tabs
          value={bottomTab}
          onChange={(_, newTab) => setBottomTab(newTab)}
          sx={{ borderBottom: 1, borderColor: 'divider', flexGrow: 1 }}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
        >
          <Tab label={t('Response')} />
          <Tab label={t('Headers')} />
          <Tab label={t('Statistic')} />
        </Tabs>
      </Stack>
      <Box>
        {bottomTab === 0 && (
          <ResponseBlock
            response={response}
            errorMessage={errorMessage}
            unknownErrorText={unknownErrorText}
            internalErrorText={internalErrorText}
          />
        )}
        {bottomTab === 1 && (
          <ResponseHeaders
            response={response}
            errorMessage={errorMessage}
            unknownErrorText={unknownErrorText}
            internalErrorText={internalErrorText}
          />
        )}
        {bottomTab === 2 && <Statistic response={response} errorMessage={errorMessage} />}
      </Box>
    </>
  );
};
