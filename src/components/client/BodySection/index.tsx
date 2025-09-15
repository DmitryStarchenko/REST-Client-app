'use client';

import Editor from '@monaco-editor/react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import React from 'react';

import { themeAtom } from '@/store';
import { BodyBlockProps } from '@/types';
import { encodeBase64 } from '@/utils';

import CopyButton from '../Shared/CopyButton';

const BodyBlock: React.FC<BodyBlockProps> = ({ bodyText, setBodyText }) => {
  const handleClick = (): void => {
    const encoded = encodeBase64(bodyText || '');
    navigator.clipboard?.writeText(encoded);
  };
  return (
    <Box>
      <Typography variant="subtitle1">Body</Typography>
      <Box sx={{ mt: 1, borderRadius: 1, overflow: 'hidden', position: 'relative' }}>
        <Editor
          height="200px"
          language="json"
          value={bodyText}
          theme={useAtomValue(themeAtom)}
          onChange={(val) => setBodyText(val ?? '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: 'ui-monospace, monospace',
            automaticLayout: true,
          }}
        />
        <CopyButton getValue={() => bodyText} />
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Button onClick={handleClick} size="small" variant="contained">
          Copy base64
        </Button>
      </Stack>
    </Box>
  );
};

export default BodyBlock;
