'use client';

import React from 'react';

import { useBodyBlock } from '@/components/client/hooks';
import { BodyBlockProps, ReadonlyFC } from '@/types';

import { BodyActions } from './BodyActions';
import styles from './BodyBlock.module.css';
import { BodyEditor } from './BodyEditor';
import { BodyTypeSelector } from './BodyTypeSelector';

const BodyBlock: ReadonlyFC<BodyBlockProps> = ({ bodyText, setBodyText }) => {
  const { bodyType, jsonError, canPrettify, setBodyType, handleCopyBase64, handlePrettifyJson } =
    useBodyBlock({ bodyText, setBodyText });

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBox}>
        <BodyActions
          onCopyBase64={handleCopyBase64}
          onPrettifyJson={handlePrettifyJson}
          canPrettify={!!canPrettify}
          hasJsonError={!!jsonError}
          hasBodyText={!!bodyText}
        />
        <BodyTypeSelector
          bodyType={bodyType}
          jsonError={jsonError}
          onBodyTypeChange={setBodyType}
        />
      </div>
      <BodyEditor bodyText={bodyText} onBodyTextChange={setBodyText} bodyType={bodyType} />
    </div>
  );
};

export default BodyBlock;
