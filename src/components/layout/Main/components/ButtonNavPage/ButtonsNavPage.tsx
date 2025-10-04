import { useTranslations } from 'next-intl';
import React from 'react';

import { Link } from '@/i18n/navigation';

import styles from './ButtonsNavPage.module.css';

interface Props {
  closeNavigationMenu?: () => void;
}

const ButtonsNavPage = ({ closeNavigationMenu }: Props): React.JSX.Element => {
  const translationMain = useTranslations('Main');

  return (
    <>
      <Link className={styles.navButton} href={'/client'} onClick={closeNavigationMenu}>
        {translationMain('client')}
      </Link>
      <Link className={styles.navButton} href={'/variables'} onClick={closeNavigationMenu}>
        {translationMain('variables')}
      </Link>
      <Link className={styles.navButton} href={'/history'} onClick={closeNavigationMenu}>
        {translationMain('history')}
      </Link>
    </>
  );
};

export default ButtonsNavPage;
