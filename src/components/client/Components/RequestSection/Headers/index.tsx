'use client';

import { Stack } from '@mui/material';
import React from 'react';

import { HeadersBlockProps } from '@/components/client/types';
import { useHeaders } from '@/hooks/useHeaders';
import { ReadonlyFC } from '@/types';

import HeaderRow from './HeaderRow';
import styles from './HeadersBlock.module.css';

const HeadersBlock: ReadonlyFC<HeadersBlockProps> = ({ headers, setHeaders }) => {
  const { handleHeaderChange, handleHeaderRemove } = useHeaders(headers, setHeaders);

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBox}>
        <Stack className={styles.headersStack}>
          {headers.map((header, index) => (
            <HeaderRow
              key={header.id}
              header={header}
              index={index}
              totalHeaders={headers.length}
              onUpdate={handleHeaderChange}
              onRemove={handleHeaderRemove}
            />
          ))}
        </Stack>
      </div>
    </div>
  );
};

export default HeadersBlock;
