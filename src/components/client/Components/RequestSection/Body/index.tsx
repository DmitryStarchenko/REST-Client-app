'use client';

import { Box, Button, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { useState, useEffect } from 'react';

import { languageMap } from '@/constants';
import { BodyBlockProps, ReadonlyFC } from '@/types';
import { encodeBase64 } from '@/utils';

import { CodeEditor } from '../../Shared';
import styles from '../TopSection.module.css';

const BodyBlock: ReadonlyFC<BodyBlockProps> = ({ bodyText, setBodyText }) => {
  const t = useTranslations('BodyBlock');
  const [bodyType, setBodyType] = useState<keyof typeof languageMap>('JSON');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleClick = (): void => {
    const encoded = encodeBase64(bodyText || '');
    navigator.clipboard?.writeText(encoded);
  };

  const handlePrettifyJson = (): void => {
    try {
      if (bodyText.trim()) {
        const parsedJson = JSON.parse(bodyText);
        const formattedJson = JSON.stringify(parsedJson, null, 2);
        setBodyText(formattedJson);
        setJsonError(null);
      }
    } catch (err) {
      setJsonError((err as Error).message);
    }
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
  const isJson = bodyType === 'JSON';
  const canPrettify = isJson && bodyText.trim() && !jsonError;

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBox}>
        <Box gap={1} display={'flex'}>
          <Button
            data-testid="copy-base-button"
            className={styles.copyButton}
            onClick={handleClick}
            size="small"
            variant="outlined"
            disabled={!!jsonError || !bodyText}
            sx={{
              color: 'inherit',
              opacity: bodyText ? '0.6' : '0.3',
              '&:hover': {
                opacity: bodyText ? 0.8 : 0.3,
              },
              minWidth: 180,
            }}
          >
            {t(`Copy base64`)}
          </Button>
          <Button
            data-testid="prettify-button"
            className={styles.prettifyButton}
            onClick={handlePrettifyJson}
            size="small"
            variant="outlined"
            disabled={!canPrettify}
            sx={{
              color: 'inherit',
              opacity: canPrettify ? '0.6' : '0.3',
              '&:hover': {
                opacity: canPrettify ? 0.8 : 0.3,
              },
              minWidth: 180,
            }}
          >
            {t('Prettify JSON')}
          </Button>
        </Box>
        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}
        >
          {jsonError && (
            <Typography variant="caption" color="warning" className={styles.errorText}>
              {t('Invalid JSON')}: {jsonError}
            </Typography>
          )}
          <Select
            data-testid="select-body-type"
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
  );
};

export default BodyBlock;
