'use client';

import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

import { FormSection } from './FormSection';
import { RequestSection } from './RequestSection';
import { ResponseSection } from './ResponseSection';
import styles from './RestClient.module.css';
import { useRestClient } from '../hooks/useRestClient';
import { ActiveSection } from '../types';
import { AnimatedSection } from './SectionNavigator/AnimatedSection';
import { SectionNavigator } from './SectionNavigator/SectionNavigator';

const RestClient: React.FC = () => {
  const t = useTranslations('RestClient');
  const {
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
  } = useRestClient();

  const handleSectionChange = (section: ActiveSection, newDirection: number): void => {
    setDirection(newDirection);
    setActiveSection(section);
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h4" mb={2} textAlign="center">
        {t('Title')}
      </Typography>

      <SectionNavigator
        activeSection={activeSection}
        onToggle={toggleSection}
        onSectionChange={handleSectionChange}
      />

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

        <AnimatedSection
          activeSection={activeSection}
          direction={direction}
          requestSection={
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
          }
          responseSection={
            <ResponseSection
              response={response}
              errorMessage={errorMessage}
              unknownErrorText={t('UError')}
              internalErrorText={t('IError')}
            />
          }
        />
      </form>
    </Box>
  );
};

export default RestClient;
