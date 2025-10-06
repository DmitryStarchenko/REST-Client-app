'use client';

import React from 'react';

import { BodyEditorProps } from '@/components/client/types';
import { languageMap } from '@/constants';
import { ReadonlyFC } from '@/types';

import styles from './BodyBlock.module.css';
import { CodeEditor } from '../../Shared';

export const BodyEditor: ReadonlyFC<BodyEditorProps> = ({
  bodyText,
  onBodyTextChange,
  bodyType,
}) => {
  return (
    <div className={styles.editorBox}>
      <CodeEditor
        value={bodyText}
        onChange={onBodyTextChange}
        height="300px"
        language={languageMap[bodyType]}
      />
    </div>
  );
};
