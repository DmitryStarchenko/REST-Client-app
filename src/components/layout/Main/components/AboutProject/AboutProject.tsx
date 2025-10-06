import { Box, Container, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

import { ReadonlyFC } from '@/types/readonly.types';

import styles from './AboutProject.module.css';

const AboutProject: ReadonlyFC = () => {
  const translationAbout = useTranslations('About');

  return (
    <Box className={styles.about}>
      <Typography variant="h4">{translationAbout('aboutProject')}</Typography>
      <Container className={styles.container}>
        <Container className={styles.project}>
          <div className={styles.logoProject}></div>
          <Typography fontSize={20}>{translationAbout('project1')}</Typography>
          <Typography fontSize={20}>{translationAbout('project2')}</Typography>
          <Typography fontSize={20}>{translationAbout('project3')}</Typography>
        </Container>
      </Container>
    </Box>
  );
};

export default AboutProject;
