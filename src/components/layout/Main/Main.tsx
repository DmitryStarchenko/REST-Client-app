'use client';
import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';
import React from 'react';

import { authAtom } from '@/store/authAtom';
import { ReadonlyFC } from '@/types/readonly.types';

import About from './components/About/About';
import ButtonsNavPage from './components/ButtonNavPage/ButtonsNavPage';
import styles from './Main.module.css';
import ButtonsSignInUp from '../Header/Components/ButtonsSignInUp/ButtonsSignInUp';

const Main: ReadonlyFC = () => {
  const translationMain = useTranslations('Main');

  const auth = useAtomValue(authAtom);
  const userName = auth?.user_metadata.first_name;

  return (
    <main className={styles.main}>
      {auth ? (
        <Box className={styles.container}>
          <p className={styles.welcomeText}>
            {translationMain('welcomeBack')}, {userName ? userName : 'User'}
          </p>
          <nav className={styles.mainNav}>
            <ButtonsNavPage />
          </nav>
        </Box>
      ) : (
        <Box className={styles.container}>
          <p className={styles.welcomeText}>{translationMain('welcome')}</p>
          <nav className={styles.mainNav}>
            <ButtonsSignInUp />
          </nav>
        </Box>
      )}
      <About />
    </main>
  );
};

export default Main;
