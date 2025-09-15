'use client';

import Editor from '@monaco-editor/react';
import { Box, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import React, { useState, useEffect, useMemo } from 'react';

import { LANG_MAP } from '@/constants';
import { useCodegen } from '@/hooks';
import { themeAtom } from '@/store';
import { CodegenSectionProps } from '@/types';

import LangTabs from './LangTabs';

const CodegenSection: React.FC<CodegenSectionProps> = ({ method, url, headers, bodyText }) => {
  const langs = useMemo(() => Object.keys(LANG_MAP), []);
  const [codeLang, setCodeLang] = useState<string>(() => langs[0] ?? '');
  const [cache, setCache] = useState<Record<string, string>>({});
  const { generateForLang } = useCodegen(method, url, headers, bodyText);

  useEffect(() => {
    if (!codeLang) return;

    if (!(codeLang in cache)) {
      generateForLang(codeLang)
        .then((code) => {
          setCache((prev) => ({ ...prev, [codeLang]: code }));
        })
        .catch(() => {
          setCache((prev) => ({
            ...prev,
            [codeLang]: 'Error generating code',
          }));
        });
    }
  }, [codeLang, cache, generateForLang]);

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {langs.length > 0 ? `Generated code` : `No languages available.`}
      </Typography>
      <LangTabs langs={langs} selectedLang={codeLang} onSelect={setCodeLang} />
      <Box>
        <Editor
          height="calc(100vh - 400px)"
          language={LANG_MAP[codeLang] ?? 'plaintext'}
          value={cache[codeLang] ?? 'Generating...'}
          theme={useAtomValue(themeAtom)}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: 'ui-monospace, monospace',
            automaticLayout: true,
          }}
        />
      </Box>
    </Box>
  );
};

export default CodegenSection;
