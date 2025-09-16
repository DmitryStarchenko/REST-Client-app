'use client';

import { Button, Stack, Typography } from '@mui/material';
import React from 'react';

import { BodyBlockProps } from '@/types';
import { encodeBase64 } from '@/utils';

import { CodeEditor } from '../../Shared';

const BodyBlock: React.FC<BodyBlockProps> = ({ bodyText, setBodyText }) => {
  const handleClick = (): void => {
    const encoded = encodeBase64(bodyText || '');
    navigator.clipboard?.writeText(encoded);
  };
  return (
    <>
      <Typography variant="subtitle1">Body</Typography>
      <CodeEditor value={bodyText} onChange={setBodyText} height="200px" language="json" />
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Button onClick={handleClick} size="small" variant="contained">
          Copy base64
        </Button>
      </Stack>
    </>
  );
};

export default BodyBlock;
