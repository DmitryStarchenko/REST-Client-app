'use client';

import { SwapVert, SwapHoriz } from '@mui/icons-material';
import { Fab, Switch, Tooltip } from '@mui/material';
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
  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newSection = event.target.checked ? 'Response' : 'Request';
    const direction = newSection === 'Response' ? 1 : -1;
    onSectionChange(newSection, direction);
  };

  const oppositeSection = (section: ActiveSection): string =>
    ({ Request: 'Response', Response: 'Request' })[section];

  return (
    <div className={styles.wrapper}>
      <Tooltip title={t(oppositeSection(activeSection))} placement="left">
        <Fab color="primary" onClick={onToggle} className={styles.fab} size="medium">
          {activeSection === 'Request' ? <SwapVert /> : <SwapHoriz />}
        </Fab>
      </Tooltip>
      <Tooltip title={t('Toggle request/response')} placement="top">
        <div className={styles.toggleContainer}>
          <Switch checked={activeSection === 'Response'} onChange={handleToggle} />
        </div>
      </Tooltip>
    </div>
  );
};
