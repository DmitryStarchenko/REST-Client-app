import { Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';

import { ReadonlyFC } from '@/types/readonly.types';

import styles from './Footer.module.css';

const Footer: ReadonlyFC = () => {
  return (
    <footer className={styles.footer}>
      <Link className={styles.logoRS} href={'https://rs.school/courses/reactjs'}></Link>
      <div className={styles.authors}>
        <Link className={styles.author} href={'https://github.com/DmitryStarchenko'}>
          <div className={styles.logoGH}></div>
          Dmitry Starchenko
        </Link>
        <Link className={styles.author} href={'https://github.com/husanGuru'}>
          <div className={styles.logoGH}></div>
          Husan Abdigafurov
        </Link>
        <Link className={styles.author} href={'https://github.com/Bubnov-Roma'}>
          <div className={styles.logoGH}></div>
          Bubnov Roma
        </Link>
      </div>
      <Typography className={styles.year}>© 2025 PUTMAN</Typography>
    </footer>
  );
};

export default Footer;
