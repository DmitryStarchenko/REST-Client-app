'use client';

import { Button, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { useState, useEffect } from 'react';

import { languageMap } from '@/constants';
import { BodyBlockProps } from '@/types';
import { encodeBase64 } from '@/utils';

import { CodeEditor } from '../../Shared';
import styles from '../TopSection.module.css';

const BodyBlock: React.FC<BodyBlockProps> = ({ bodyText, setBodyText }) => {
  const t = useTranslations('BodyBlock');
  const [bodyType, setBodyType] = useState<keyof typeof languageMap>('JSON');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleClick = (): void => {
    const encoded = encodeBase64(bodyText || '');
    navigator.clipboard?.writeText(encoded);
  };

  useEffect(() => {
    if (bodyType === 'JSON') {
      try {
        if (bodyText.trim()) {
          JSON.parse(bodyText);
        }
        setJsonError(null);
      } catch (err) {
        setJsonError((err as Error).message);
      }
    } else {
      setJsonError(null);
    }
  }, [bodyText, bodyType]);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.topBox}>
          <Button
            className={styles.copyButton}
            onClick={handleClick}
            size="small"
            variant="outlined"
            disabled={!!jsonError}
            sx={{
              color: 'inherit',
              opacity: '0.6',
              '&:hover': {
                opacity: 0.8,
              },
              minWidth: 180,
            }}
          >
            {t(`Copy base64`)}
          </Button>
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}
          >
            {jsonError && (
              <Typography variant="body2" color="warning" className={styles.errorText}>
                {t('Invalid JSON')}: {jsonError}
              </Typography>
            )}
            <Select
              className={styles.selector}
              size="small"
              sx={{
                opacity: 0.6,
                '&:hover': {
                  opacity: 0.8,
                },
                minWidth: 180,
              }}
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value as keyof typeof languageMap)}
            >
              {Object.keys(languageMap).map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </div>
        <div className={styles.editorBox}>
          <CodeEditor
            value={bodyText}
            onChange={setBodyText}
            height="300px"
            language={languageMap[bodyType]}
          />
        </div>
      </div>
    </>
  );
};

export default BodyBlock;
