'use client';

import { useTranslations } from 'next-intl';
import React, { useState, useEffect, useMemo } from 'react';

import { LANG_MAP } from '@/constants';
import { useCodegen } from '@/hooks';
import { CodegenSectionProps, ReadonlyFC } from '@/types';
import { replaceVariables } from '@/utils/';

import styles from '../RequestSection.module.css';
import LangSelect from './LangSelect';
import { CodeEditor } from '../../Shared';

const CodegenSection: ReadonlyFC<CodegenSectionProps> = ({
  method,
  url,
  headers,
  body,
  codeLang,
  setCodeLang,
  variablesObj,
}) => {
  const t = useTranslations('RestClient');
  const langs = useMemo(() => Object.keys(LANG_MAP), []);
  const [cache, setCache] = useState<Record<string, string>>({});

  const processedUrl = replaceVariables(url, variablesObj);
  const processedHeaders = headers
    .map((header) => ({
      ...header,
      key: replaceVariables(header.key, variablesObj),
      value: replaceVariables(header.value, variablesObj),
    }))
    .filter((header) => header.key && header.value);
  const processedBody = replaceVariables(body || '', variablesObj);

  const { generateForLang } = useCodegen(method, processedUrl, processedHeaders, processedBody);

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
