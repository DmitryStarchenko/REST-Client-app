'use client';
import { Box, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';
import React from 'react';

import About from '@/components/layout/Main/components/about/about';
import { authAtom } from '@/store/authAtom';
import { ReadonlyFC } from '@/types/readonly.types';

import ButtonsNavPage from './components/buttonNavPage/ButtonsNavPage';
import styles from './Main.module.css';
import ButtonsSignInUp from '../Header/ButtonsSignInUp/ButtonsSignInUp';

const Main: ReadonlyFC = () => {
  const translationMain = useTranslations('Main');

  const auth = useAtomValue(authAtom);

  return (
    <main className={styles.main}>
      {auth ? (
        <Box className={styles.container}>
          <Typography variant="h3">{translationMain('welcomeBack')}</Typography>
          <nav className={styles.mainNav}>
            <ButtonsNavPage />
          </nav>
        </Box>
      ) : (
        <Box className={styles.container}>
          <Typography variant="h3">{translationMain('welcome')}</Typography>
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
