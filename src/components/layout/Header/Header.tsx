'use client';
import { useAtomValue } from 'jotai';
import React from 'react';
import { useEffect, useState } from 'react';

import { Link } from '@/i18n/navigation';
import { authAtom } from '@/store/authAtom';
import { ReadonlyFC } from '@/types/readonly.types';

import styles from './Header.module.css';
import LangSwitcher from '../LangSwitcher/LangSwitcher';
import ThemeToggler from '../ThemeToggler/ThemeToggler';
import BurgerMenu from './Components/BurgerMenu/BurgerMenu';
import ButtonNavigation from './Components/ButtonNavigation/ButtonNavigation';
import ButtonsSignInUp from './Components/ButtonsSignInUp/ButtonsSignInUp';

const Header: ReadonlyFC = () => {
  const [screenWidth, setScreenWidth] = useState<number>();
  const [isCompact, setIsCompact] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
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
    <>
      <div className={isNavigationOpen ? styles.background : ''}></div>
      <header className={`${styles.header} ${isCompact ? styles.headerCompact : ''}`}>
        <Link className={styles.logoContainer} href={'/'}>
          <div className={`${styles.logo} ${isCompact ? styles.logoCompact : ''}`}></div>
        </Link>
        <nav className={styles.navigation}>
          {screenWidth && screenWidth > 940 ? (
            auth ? (
              <ButtonNavigation />
            ) : (
              <ButtonsSignInUp />
            )
          ) : (
            <BurgerMenu
              isNavigationOpen={isNavigationOpen}
              setIsNavigationOpen={setIsNavigationOpen}
            />
          )}
          <LangSwitcher />
          <ThemeToggler />
        </nav>
      </header>
    </>
  );
};

export default Header;
