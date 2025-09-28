'use client';
import { useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useEffect, useState } from 'react';

import { Link } from '@/i18n/navigation';
import supabaseClient from '@/lib/supabase/client';
import { authAtom } from '@/store/authAtom';
import { ReadonlyFC } from '@/types/readonly.types';

import styles from './Header.module.css';
import LangSwitcher from '../LangSwitcher/LangSwitcher';
import ThemeToggler from '../ThemeToggler/ThemeToggler';
import BurgerMenu from './Components/BurgerMenu/BurgerMenu';
import ButtonsSignInUp from './Components/ButtonsSignInUp/ButtonsSignInUp';
import ButtonsNavPage from '../Main/components/ButtonNavPage/ButtonsNavPage';

const Header: ReadonlyFC = () => {
  const translationNav = useTranslations('Navigation');
  const [screenWidth, setScreenWidth] = useState<number>();
  const [isCompact, setIsCompact] = useState(false);
  const auth = useAtomValue(authAtom);

  const handleResize = (): void => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return (): void => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      {screenWidth && screenWidth > 940 ? (
        <nav className={styles.navigation}>
          {auth ? (
            <>
              <Link className={styles.navButton} href={'/'}>
                {translationNav('main')}
              </Link>
              <ButtonsNavPage />
              <Link
                className={styles.navButton}
                href={'/'}
                onClick={() => supabaseClient.auth.signOut()}
              >
                {translationNav('signOut')}
              </Link>
            </>
          ) : (
            <>
              <ButtonsSignInUp />
            </>
          )}

          <LangSwitcher />
          <ThemeToggler />
        </nav>
      ) : (
        <BurgerMenu />
      )}
    </header>
  );
};

export default Header;
