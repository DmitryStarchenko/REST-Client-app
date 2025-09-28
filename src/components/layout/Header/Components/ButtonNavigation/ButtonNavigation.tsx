import { useTranslations } from 'next-intl';

import ButtonsNavPage from '@/components/layout/Main/components/ButtonNavPage/ButtonsNavPage';
import { Link } from '@/i18n';
import supabaseClient from '@/lib/supabase/client';
import { ReadonlyFC } from '@/types';

import styles from './ButtonNavigation.module.css';

interface Props {
  closeNavigationMenu?: () => void;
}

const ButtonNavigation: ReadonlyFC<Props> = ({ closeNavigationMenu }: Props) => {
  const translationNav = useTranslations('Navigation');
  const handleClickSignOut = (): void => {
    supabaseClient.auth.signOut();
    if (closeNavigationMenu) closeNavigationMenu();
  };

  return (
    <>
      <Link className={styles.navButton} href={'/'} onClick={closeNavigationMenu}>
        {translationNav('main')}
      </Link>
      <ButtonsNavPage />
      <Link className={styles.navButton} href={'/'} onClick={handleClickSignOut}>
        {translationNav('signOut')}
      </Link>
    </>
  );
};

export default ButtonNavigation;
