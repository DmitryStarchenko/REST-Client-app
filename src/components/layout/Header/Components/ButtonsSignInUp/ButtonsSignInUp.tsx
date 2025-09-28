import { useTranslations } from 'next-intl';
import React from 'react';

import { Link } from '@/i18n/navigation';

import styles from './ButtonsSignInUp.module.css';
interface Props {
  closeNavigationMenu?: () => void;
}

const ButtonsSignInUp = ({ closeNavigationMenu }: Props): React.JSX.Element => {
  const translationNav = useTranslations('Navigation');

  return (
    <>
      <Link className={styles.navButton} href={'/login'} onClick={closeNavigationMenu}>
        {translationNav('signIn')}
      </Link>
      <Link className={styles.navButton} href={'/registration'} onClick={closeNavigationMenu}>
        {translationNav('signUp')}
      </Link>
    </>
  );
};

export default ButtonsSignInUp;
