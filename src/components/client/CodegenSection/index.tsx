'use client';

import { Typography } from '@mui/material';
import React, { useState, useEffect, useMemo } from 'react';

import { LANG_MAP } from '@/constants';
import { useCodegen } from '@/hooks';
import { CodegenSectionProps } from '@/types';

import styles from './CodegenSection.module.css';
import LangSelect from './LangSelect';
import { CodeEditor } from '../Shared';

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
    <>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {langs.length > 0 ? `Generated code` : `No languages available.`}
      </Typography>

      <div className={styles.wrapper}>
        <div className={styles.langBox}>
          <LangSelect langs={langs} selectedLang={codeLang} onSelect={setCodeLang} />
        </div>

        <div className={styles.editorBox}>
          <CodeEditor
            value={cache[codeLang] ?? 'Generating...'}
            height="200px"
            language={LANG_MAP[codeLang] ?? 'plaintext'}
          />
        </div>
      </div>
    </>
  );
};

export default CodegenSection;
