'use client';

import { Box } from '@mui/material';
import React from 'react';

import { ResponseHeadersSectionProps } from '@/types';

import { CodeEditor } from '../../Shared';
import ResponseBlock from '../Response';
import styles from '../ResponseBlock.module.css';

const ResponseHeaders: React.FC<ResponseHeadersSectionProps> = ({
  response,
  errorMessage,
  unknownErrorText,
  internalErrorText,
}) => {
  return response && response.headers != null ? (
    <div className={styles.wrapper}>
      <div className={styles.topBox}>
        <div className={styles.editorBox}>
          <Box>
            <CodeEditor
              value={JSON.stringify(response.headers, null, 2)}
              height="340px"
              language="json"
              readOnly
              data-testid="code-editor"
            />
          </Box>
        </div>
      </div>
    </div>
  ) : (
    <ResponseBlock
      response={response}
      errorMessage={errorMessage}
      unknownErrorText={unknownErrorText}
      internalErrorText={internalErrorText}
      data-testid="response-block"
    />
  );
};

export default ResponseHeaders;
