'use client';

import { Box, Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

import { BodyActionsProps } from '@/components/client/types';
import { ReadonlyFC } from '@/types';

import styles from './BodyBlock.module.css';

export const BodyActions: ReadonlyFC<BodyActionsProps> = ({
  onCopyBase64,
  onPrettifyJson,
  canPrettify,
  hasJsonError,
  hasBodyText,
}) => {
  const t = useTranslations('RestClient');

  return (
    <Box className={styles.buttonGroup}>
      <Button
        data-testid="copy-base-button"
        className={styles.copyButton}
        onClick={onCopyBase64}
        size="small"
        variant="outlined"
        disabled={hasJsonError || !hasBodyText}
      >
        {t('Copy base64')}
      </Button>
      <Button
        data-testid="prettify-button"
        className={styles.prettifyButton}
        onClick={onPrettifyJson}
        size="small"
        variant="outlined"
        disabled={!canPrettify}
      >
        {t('Prettify JSON')}
      </Button>
    </Box>
  );
};
