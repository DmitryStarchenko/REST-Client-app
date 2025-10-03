import { Container, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Link } from '@/i18n';
import { ReadonlyFC } from '@/types/readonly.types';

import styles from './Footer.module.css';

const Footer: ReadonlyFC = () => {
  const translationFooter = useTranslations('Footer');

  return (
    <footer className={styles.footer}>
      <Container className={styles.links}>
        <Link className={styles.navButton} href={'/about'}>
          {translationFooter('About')}
        </Link>
        <Link className={styles.navButton} href={'/contacts'}>
          {translationFooter('Contacts')}
        </Link>
      </Container>
      <Typography className={styles.year}>© 2025 PUTMAN</Typography>
    </footer>
  );
};

export default Footer;
