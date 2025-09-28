import { useAtomValue } from 'jotai';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

import { authAtom } from '@/store/authAtom';
import { ReadonlyFC } from '@/types';

import styles from './BurgerMenu.module.css';
import ButtonNavigation from '../ButtonNavigation/ButtonNavigation';
import ButtonsSignInUp from '../ButtonsSignInUp/ButtonsSignInUp';

interface Props {
  isNavigationOpen: boolean;
  setIsNavigationOpen: Dispatch<SetStateAction<boolean>>;
}

const BurgerMenu: ReadonlyFC<Props> = ({ isNavigationOpen, setIsNavigationOpen }: Props) => {
  const auth = useAtomValue(authAtom);

  const navigationMenuRef = useRef<HTMLDivElement>(null);
  const navigationButtonRef = useRef<HTMLButtonElement>(null);

  const toggleNavigationMenu = useCallback((): void => {
    setIsNavigationOpen((prev) => !prev);
  }, []);

  const closeNavigationMenu = useCallback((): void => {
    setIsNavigationOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        navigationMenuRef.current?.contains(event.target as Node) ||
        navigationButtonRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      closeNavigationMenu();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeNavigationMenu]);

  return (
    <div className={styles.burgerMenu} ref={navigationMenuRef}>
      <button
        ref={navigationButtonRef}
        className={`${styles.burgerButton} ${isNavigationOpen ? styles.burgerButtonActive : ''}`}
        onClick={toggleNavigationMenu}
        aria-label="Menu"
        aria-expanded={isNavigationOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      {isNavigationOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.menuContent}>
            <nav className={styles.navigation}>
              {auth ? (
                <ButtonNavigation closeNavigationMenu={closeNavigationMenu} />
              ) : (
                <ButtonsSignInUp closeNavigationMenu={closeNavigationMenu} />
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default BurgerMenu;
