'use client';
import dynamic from 'next/dynamic';
import { FC } from 'react';

import Loader from '@/components/shared/Loader/Loader';

const Variables = dynamic(() => import('@/components/variables/Variables'), {
  ssr: false,
  loading: () => <Loader />,
});

const VariablesPage: FC = () => {
  return <Variables />;
};

export default VariablesPage;
