'use client';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useEffect, useState } from 'react';

import { Link } from '@/i18n/navigation';
import { ReadonlyFC } from '@/types/readonly.types';

import styles from './Header.module.css';
import LangSwitcher from '../LangSwitcher/LangSwitcher';
import ThemeToggler from '../ThemeToggler/ThemeToggler';

const Header: ReadonlyFC = () => {
  const t = useTranslations('Navigation');
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsCompact(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isCompact ? styles.headerCompact : ''}`}>
      <Link className={styles.logoContainer} href={'/'}>
        <div className={`${styles.logo} ${isCompact ? styles.logoCompact : ''}`}></div>
      </Link>
      <nav className={styles.navigation}>
        <Link className={styles.navButton} href={'/login'}>
          {t('signIn')}
        </Link>
        <Link className={styles.navButton} href={'/registration'}>
          {t('signUp')}
        </Link>
        <Link className={styles.navButton} href={'/'}>
          {t('signOut')}
        </Link>
        <LangSwitcher />
        <ThemeToggler />
      </nav>
    </header>
  );
};

export default Header;
