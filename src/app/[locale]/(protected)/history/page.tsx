import dynamic from 'next/dynamic';
import React from 'react';

import styles from '@/components/History/History.module.css';
import Loader from '@/components/shared/Loader/Loader';

const History = dynamic(() => import('@/components/History/LayoutHistoryContent'), {
  ssr: true,
  loading: () => (
    <main className={styles.main}>
      <Loader />
    </main>
  ),
});

export default History;
