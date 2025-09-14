'use client';

import dynamic from 'next/dynamic';

import { ReadonlyFC } from '@/types';

const RestClient = dynamic(() => import('@/components/client/RestClient'), {
  ssr: false,
  loading: () => <div>Loading REST Client</div>,
});

const ClientWrapper: ReadonlyFC = () => {
  return <RestClient />;
};

export default ClientWrapper;
