'use client';

import { Button, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { useState, useEffect } from 'react';

import { BodyBlockProps } from '@/types';
import { encodeBase64 } from '@/utils';

import { CodeEditor } from '../../Shared';

const languageMap: Record<string, string> = {
  JSON: 'json',
  TEXT: 'plaintext',
  XML: 'xml',
  HTML: 'html',
  JavaScript: 'javascript',
};

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
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="subtitle1">{t(`Body`)}</Typography>

        <Select
          size="small"
          value={bodyType}
          onChange={(e) => setBodyType(e.target.value as keyof typeof languageMap)}
          sx={{ minWidth: 120 }}
        >
          {Object.keys(languageMap).map((key) => (
            <MenuItem key={key} value={key}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <CodeEditor
        value={bodyText}
        onChange={setBodyText}
        height="200px"
        language={languageMap[bodyType]}
      />

      <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: 'space-between' }}>
        <Button onClick={handleClick} size="small" variant="contained" disabled={!!jsonError}>
          {t(`Copy base64`)}
        </Button>
        {jsonError && (
          <Typography variant="body2" color="warning" sx={{ mt: 1, opacity: 0.6 }}>
            {t('Invalid JSON')}: {jsonError}
          </Typography>
        )}
      </Stack>
    </>
  );
};

export default BodyBlock;
