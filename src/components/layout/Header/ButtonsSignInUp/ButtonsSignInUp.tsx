import { useTranslations } from 'next-intl';
import React from 'react';

import { Link } from '@/i18n/navigation';
import { ReadonlyFC } from '@/types/readonly.types';

import styles from './ButtonsSignInUp.module.css';

const ButtonsSignInUp: ReadonlyFC = () => {
  const t = useTranslations('Navigation');

  return (
    <>
      <Link className={styles.navButton} href={'/login'}>
        {t('signIn')}
      </Link>
      <Link className={styles.navButton} href={'/registration'}>
        {t('signUp')}
      </Link>
    </>
  );
};

export default ButtonsSignInUp;
