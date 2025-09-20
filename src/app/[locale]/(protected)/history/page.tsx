import dynamic from 'next/dynamic';
import React from 'react';

import Loader from '@/components/shared/Loader/Loader';

import styles from '../../../../components/layout/History/History.module.css';

const History = dynamic(
  () => import('../../../../components/layout/History/LayoutHistoryContent'),
  {
    ssr: true,
    loading: () => (
      <main className={styles.main}>
        <Loader />
      </main>
    ),
  },
);

export default History;
