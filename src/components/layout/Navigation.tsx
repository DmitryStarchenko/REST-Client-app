import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { ReadonlyFC } from '@/types/readonly.types';

import LangSwitcher from './LangSwitcher/LangSwitcher';
import styles from './Layout.module.css';
import ThemeToggler from './ThemeToggler/ThemeToggler';

const Navigation: ReadonlyFC = () => {
  const t = useTranslations('Navigation');

  return (
    <div className={styles.navigation}>
      <Link href={'/'}>{t('Main')}</Link>

      <ThemeToggler />
      <LangSwitcher />
    </div>
  );
};

export default Navigation;
