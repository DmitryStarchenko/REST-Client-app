'use client';

import { Box } from '@mui/material';

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
  return response?.headers ? (
    <div className={styles.wrapper}>
      <div className={styles.topBox}>
        <div className={styles.editorBox}>
          <Box>
            <CodeEditor
              value={JSON.stringify(response.headers, null, 2)}
              height="340px"
              language="json"
              readOnly
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
    />
  );
};

export default ResponseHeaders;
