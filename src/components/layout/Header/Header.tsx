'use client';
import { useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';
import React, { useCallback, useRef } from 'react';
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
  const compactRef = useRef(isCompact);
  const rafId = useRef<number | null>(null);
  const lastScrollY = useRef(0);

  const handleResize = (): void => {
    setScreenWidth(window.innerWidth);
  };

  const handleScroll = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const scrollDownThreshold = 50;
      const scrollUpThreshold = 35;

      let shouldBeCompact = compactRef.current;

      if (currentScrollY > lastScrollY.current) {
        shouldBeCompact = currentScrollY > scrollDownThreshold;
      } else {
        shouldBeCompact = currentScrollY > scrollUpThreshold;
      }

      if (shouldBeCompact !== compactRef.current) {
        setIsCompact(shouldBeCompact);
      }

      if (shouldBeCompact !== compactRef.current) {
        compactRef.current = shouldBeCompact;
        setIsCompact(shouldBeCompact);
      }

      lastScrollY.current = currentScrollY;
    });
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return (): void => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

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
