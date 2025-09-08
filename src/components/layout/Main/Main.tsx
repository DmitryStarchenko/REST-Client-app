'use client';
import { useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';
import React from 'react';

import { authAtom } from '@/store/authAtom';
import { ReadonlyFC } from '@/types/readonly.types';

import ButtonsNavPage from './components/buttonNavPage/ButtonsNavPage';
import styles from './Main.module.css';
import ButtonsSignInUp from '../Header/ButtonsSignInUp/ButtonsSignInUp';
import About from './components/about/about';

const Main: ReadonlyFC = () => {
  const t = useTranslations('Main');

  const auth = useAtomValue(authAtom);

  return (
    <main className={styles.main}>
      {auth?.user ? (
        <div className={styles.container}>
          <h1>{t('welcomeBack')}</h1>
          <nav className={styles.mainNav}>
            <ButtonsNavPage />
          </nav>
        </div>
      ) : (
        <div className={styles.container}>
          <h1>{t('welcome')}</h1>
          <nav className={styles.mainNav}>
            <ButtonsSignInUp />
          </nav>
        </div>
      )}
      <About />
    </main>
  );
};

export default Main;
