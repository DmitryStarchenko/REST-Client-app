'use client';

import { Box, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

import { HeaderRowProps, ReadonlyFC } from '@/types';

import DeleteButton from './DeleteButton';
import HeaderField from './HeaderField';

const HeaderRow: ReadonlyFC<HeaderRowProps> = ({
  header,
  index,
  totalHeaders,
  onUpdate,
  onRemove,
}) => {
  const t = useTranslations('HeadersBlock');

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
    <Box
      sx={{
        position: 'relative',
        '&:hover .delete-btn': { opacity: 0.5 },
        gap: '2',
      }}
    >
      <Stack direction="row" spacing={1}>
        <HeaderField
          value={header.key}
          onChange={handleKeyChange}
          placeholder={t('Key')}
          incomplete={incomplete}
          tooltipText={t('Tooltip')}
          flex={1}
        />
        <HeaderField
          value={header.value}
          onChange={handleValueChange}
          placeholder={t('Value')}
          flex={2}
        />
      </Stack>
      {(!isLast || !isEmpty) && (
        <DeleteButton onRemove={() => onRemove(header.id)} tooltipText={t('Delete')} />
      )}
    </Box>
  );
};

export default HeaderRow;
