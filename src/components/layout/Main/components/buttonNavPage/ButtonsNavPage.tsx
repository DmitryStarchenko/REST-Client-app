import { useTranslations } from 'next-intl';
import React from 'react';

import { Link } from '@/i18n/navigation';
import { ReadonlyFC } from '@/types/readonly.types';

import styles from './ButtonsNavPage.module.css';

const ButtonsNavPage: ReadonlyFC = () => {
  const translationMain = useTranslations('Main');

  return (
    <>
      <Link className={styles.navButton} href={'/client'}>
        {translationMain('client')}
      </Link>
      <Link className={styles.navButton} href={'/variables'}>
        {translationMain('variables')}
      </Link>
      <Link className={styles.navButton} href={'/history'}>
        {translationMain('history')}
      </Link>
    </>
  );
};

export default ButtonsNavPage;
