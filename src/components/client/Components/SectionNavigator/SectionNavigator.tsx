'use client';

import { SwapVert, SwapHoriz } from '@mui/icons-material';
import { Box, Fab, Tooltip } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

import { ReadonlyFC } from '@/types';

import styles from './SectionNavigator.module.css';
import { ActiveSection, SectionNavigatorProps } from '../../types';

export const SectionNavigator: ReadonlyFC<SectionNavigatorProps> = ({
  activeSection,
  onToggle,
  onSectionChange,
}) => {
  const t = useTranslations('RestClient');
  const getDotClass = (section: ActiveSection): string => {
    const isActive = activeSection === section;
    return `${styles.dot} ${isActive ? styles.dotActive : styles.dotInactive}`;
  };
  const oppositeSection = (section: ActiveSection): string =>
    ({ Request: 'Response', Response: 'Request' })[section];

  return (
    <>
      <Tooltip title={t(oppositeSection(activeSection))} placement="left">
        <Fab color="primary" onClick={onToggle} className={styles.fab} size="medium">
          {activeSection === 'Request' ? <SwapVert /> : <SwapHoriz />}
        </Fab>
      </Tooltip>

      <Box className={styles.navigationContainer}>
        <Tooltip title={t('Request')} placement="left">
          <Box className={getDotClass('Request')} onClick={() => onSectionChange('Request', -1)} />
        </Tooltip>

        <Tooltip title={t('Response')} placement="right">
          <Box className={getDotClass('Response')} onClick={() => onSectionChange('Response', 1)} />
        </Tooltip>
      </Box>
    </>
  );
};
