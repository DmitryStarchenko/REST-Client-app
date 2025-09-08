import { useTranslations } from 'next-intl';
import React from 'react';

import { Link } from '@/i18n/navigation';
import { ReadonlyFC } from '@/types/readonly.types';

import styles from './ButtonsNavPage.module.css';

const ButtonsNavPage: ReadonlyFC = () => {
  const t = useTranslations('Main');

  return (
    <>
      <Link className={styles.navButton} href={'/client'}>
        {t('client')}
      </Link>
      <Link className={styles.navButton} href={'/variables'}>
        {t('variables')}
      </Link>
      <Link className={styles.navButton} href={'/history'}>
        {t('history')}
      </Link>
    </>
  );
};

export default ButtonsNavPage;
