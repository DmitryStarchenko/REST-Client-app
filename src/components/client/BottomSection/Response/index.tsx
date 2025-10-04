import { useTranslations } from 'next-intl';
import React from 'react';

import { ResponseBlockProps } from '@/types';

import { CodeEditor } from '../../Shared';
import styles from '../ResponseBlock.module.css';

const Response: React.FC<ResponseBlockProps> = ({ response, errorMessage, unknownErrorText }) => {
  const t = useTranslations('ResponseBlock');

  const getResponseContent = (): string => {
    if (errorMessage) return errorMessage;

    if (!response) return t('No response yet');

    if (response.ok) {
      return typeof response.data === 'string'
        ? response.data
        : JSON.stringify(response.data, null, 2);
    } else {
      return response.error ?? unknownErrorText;
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBox}>
        <div className={styles.editorBox}>
          <CodeEditor
            value={getResponseContent()}
            height="340px"
            language="json"
            readOnly
            data-testid="response-block"
          />
        </div>
      </div>
    </div>
  );
};

export default Response;
