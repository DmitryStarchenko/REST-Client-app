'use client';

import { Box, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

import { HeaderRowProps } from '@/components/client/types';
import { ReadonlyFC } from '@/types';

import DeleteButton from './DeleteButton';
import HeaderField from './HeaderField';
import styles from './HeadersBlock.module.css';

const HeaderRow: ReadonlyFC<HeaderRowProps> = ({
  header,
  index,
  totalHeaders,
  onUpdate,
  onRemove,
}) => {
  const t = useTranslations('RestClient');

  const isLast = index === totalHeaders - 1;
  const isEmpty = header.key === '' && header.value === '';
  const incomplete =
    (header.key !== '' && header.value === '') || (header.key === '' && header.value !== '');

  const handleKeyChange = (newKey: string): void => {
    onUpdate(header.id, newKey, header.value);
  };

  const handleValueChange = (newValue: string): void => {
    onUpdate(header.id, header.key, newValue);
  };

  return (
    <Box className={styles.container}>
      <Stack className={styles.row}>
        <HeaderField
          value={header.key}
          onChange={handleKeyChange}
          placeholder={t('Key')}
          incomplete={incomplete}
          tooltipText={t('Tooltip')}
          className={styles.keyField}
        />
        <HeaderField
          value={header.value}
          onChange={handleValueChange}
          placeholder={t('Value')}
          className={styles.valueField}
        />
      </Stack>
      {(!isLast || !isEmpty) && (
        <DeleteButton
          onRemove={() => onRemove(header.id)}
          tooltipText={t('Delete')}
          className={styles.deleteBtn}
        />
      )}
    </Box>
  );
};

export default HeaderRow;
