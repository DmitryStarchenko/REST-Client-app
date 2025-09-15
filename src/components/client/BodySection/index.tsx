'use client';

import Editor from '@monaco-editor/react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import React from 'react';

import { themeAtom } from '@/store';
import { encodeBase64 } from '@/utils/base64';

interface BodyBlockProps {
  bodyText: string;
  setBodyText: (value: string) => void;
}

const BodyBlock: React.FC<BodyBlockProps> = ({ bodyText, setBodyText }) => {
  return (
    <Box>
      <Typography variant="subtitle1">Body</Typography>
      <Box sx={{ mt: 1, borderRadius: 1, overflow: 'hidden' }}>
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
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Button
          onClick={() => {
            const encoded = encodeBase64(bodyText || '');
            navigator.clipboard?.writeText(encoded);
          }}
          size="small"
          variant="outlined"
        >
          Copy base64(body)
        </Button>
      </Stack>
    </Box>
  );
};

export default BodyBlock;
