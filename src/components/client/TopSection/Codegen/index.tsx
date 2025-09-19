'use client';

import { useTranslations } from 'next-intl';
import React, { useState, useEffect, useMemo } from 'react';

import { LANG_MAP } from '@/constants';
import { useCodegen } from '@/hooks';
import { CodegenSectionProps } from '@/types';

import styles from '../TopSection.module.css';
import LangSelect from './LangSelect';
import { CodeEditor } from '../../Shared';

const CodegenSection: React.FC<CodegenSectionProps> = ({
  method,
  url,
  headers,
  body,
  codeLang,
  setCodeLang,
}) => {
  const t = useTranslations('CodegenSection');
  const langs = useMemo(() => Object.keys(LANG_MAP), []);
  const [cache, setCache] = useState<Record<string, string>>({});
  const { generateForLang } = useCodegen(method, url, headers, body);

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
            [codeLang]: t('Error generating code'),
          }));
        });
    }
  }, [codeLang, cache, generateForLang, t]);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.topBox}>
          <LangSelect langs={langs} selectedLang={codeLang} onSelect={setCodeLang} />
        </div>

        <div className={styles.editorBox}>
          <CodeEditor
            value={cache[codeLang] ?? t('Generating')}
            height="300px"
            language={LANG_MAP[codeLang] ?? 'plaintext'}
          />
        </div>
      </div>
    </>
  );
};

export default CodegenSection;
