import dynamic from 'next/dynamic';
import React from 'react';

import styles from '@/components/layout/History/History.module.css';
import Loader from '@/components/shared/Loader/Loader';

const History = dynamic(() => import('@/components/layout/History/LayoutHistoryContent'), {
  ssr: true,
  loading: () => (
    <main className={styles.main}>
      <Loader />
    </main>
  ),
});

export default History;
