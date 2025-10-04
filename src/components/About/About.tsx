import { Box, Container, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

import { ReadonlyFC } from '@/types/readonly.types';

import styles from './About.module.css';

const About: ReadonlyFC = () => {
  const translationAbout = useTranslations('About');

  return (
    <Box className={styles.about}>
      <Typography variant="h4">{translationAbout('about')}</Typography>
      <Container className={styles.container}>
        <Container className={styles.rs}>
          <div className={styles.logoRS}></div>
          <Typography fontSize={18}>{translationAbout('rs_1')}</Typography>
          <Typography fontSize={18}>{translationAbout('rs_2')}</Typography>
        </Container>
        <Container className={styles.authors}>
          <div className={styles.logoAuthors}></div>
          <div className={styles.author}>
            <div className={styles.leadContainer}>
              <Typography variant="h5">{translationAbout('author1Name')}</Typography>
              <div className={styles.lead}></div>
            </div>
            <Typography fontSize={18}>{translationAbout('author1Description')}</Typography>
          </div>
          <div className={styles.author}>
            <Typography variant="h5">{translationAbout('author2Name')}</Typography>
            <Typography fontSize={18}>{translationAbout('author2Description')}</Typography>
          </div>
          <div className={styles.author}>
            <Typography variant="h5">{translationAbout('author3Name')}</Typography>
            <Typography fontSize={18}>{translationAbout('author3Description')}</Typography>
          </div>
        </Container>
      </Container>
    </Box>
  );
};

export default About;
