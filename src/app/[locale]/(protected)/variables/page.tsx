'use client';
import dynamic from 'next/dynamic';
import { FC } from 'react';

const Variables = dynamic(() => import('@/components/variables/Variables'), {
  ssr: false,
  loading: () => <div>Loading Variables...</div>,
});

const VariablesPage: FC = () => {
  return <Variables />;
};

export default VariablesPage;
