'use client';

import dynamic from 'next/dynamic';

import { ReadonlyFC } from '@/types';

const RestClientWrapper = dynamic(() => import('@/components/client'), {
  ssr: false,
  loading: () => <div>Loading REST client…</div>,
});

const ClientPageWrapper: ReadonlyFC = () => {
  return <RestClientWrapper />;
};

export default ClientPageWrapper;
