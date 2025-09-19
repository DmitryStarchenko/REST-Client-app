'use client';

import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { JSX } from 'react';

import { StatisticProps } from '@/types';

import styles from '../ResponseBlock.module.css';

const Statistic: React.FC<StatisticProps> = ({ response, errorMessage }) => {
  const t = useTranslations('ResponseBlock');
  const renderContent = (): JSX.Element => {
    if (errorMessage) {
      return (
        <>
          <Typography variant="body2" color="error">
            {errorMessage}
          </Typography>
          <Typography variant="body2" color="error">
            {t('Timestamp')}: {response?.timestamp ?? '-'}
          </Typography>
        </>
      );
    }

    if (!response) {
      return (
        <Typography variant="body2" color="textSecondary">
          {t('No response yet')}
        </Typography>
      );
    }

    return (
      <>
        <Typography variant="body2" color="success">
          {t('Status')}: {response?.status ?? '-'}
        </Typography>
        <Typography variant="body2" color="success">
          {t('StatusText')}: {response?.statusText ?? '-'}
        </Typography>
        <Typography variant="body2" color="success">
          {t('Success')}: {String(response?.ok)}
        </Typography>
        <Typography variant="body2" color="success">
          {t('Duration')}: {response?.durationMs ?? '-'} {t('ms')}
        </Typography>
        <Typography variant="body2" color="success">
          {t('Response')}: {response?.responseSize ?? '-'} {t('bytes')}
        </Typography>
        <Typography variant="body2" color="success">
          {t('Timestamp')}: {response?.timestamp ?? '-'}
        </Typography>
      </>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBox}>
        <div className={styles.editorBox}>
          <Stack
            spacing={2}
            sx={{
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              width: '100%',
              minHeight: '340px',
            }}
          >
            {renderContent()}
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default Statistic;
