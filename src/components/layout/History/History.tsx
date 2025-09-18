import dynamic from 'next/dynamic';
import React from 'react';

import styles from './History.module.css';
import Loader from '../../shared/Loader/Loader';

const LayoutHistory = dynamic(() => import('./LayoutHistoryContent'), {
  ssr: true,
  loading: () => (
    <main className={styles.main}>
      <Loader />
    </main>
  ),
});

export default LayoutHistory;
