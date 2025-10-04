'use client';

import { MenuItem, Select, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

import { BodyTypeSelectorProps } from '@/components/client/types';
import { languageMap } from '@/constants';
import { ReadonlyFC } from '@/types';

import styles from './BodyBlock.module.css';

export const BodyTypeSelector: ReadonlyFC<BodyTypeSelectorProps> = ({
  bodyType,
  jsonError,
  onBodyTypeChange,
}) => {
  const t = useTranslations('RestClient');

  return (
    <Stack className={styles.selectorContainer}>
      {jsonError && (
        <Typography variant="caption" className={styles.errorText}>
          {t('Invalid JSON')}: {jsonError}
        </Typography>
      )}
      <Select
        data-testid="select-body-type"
        className={styles.selector}
        size="small"
        value={bodyType}
        onChange={(e) => onBodyTypeChange(e.target.value as keyof typeof languageMap)}
      >
        {Object.keys(languageMap).map((key) => (
          <MenuItem key={key} value={key}>
            {key}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
};
