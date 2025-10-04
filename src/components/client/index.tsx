'use client';

import dynamic from 'next/dynamic';

import { ReadonlyFC } from '@/types';

import Loader from '../shared/Loader/Loader';

const RestClient = dynamic(() => import('@/components/client/RestClient'), {
  ssr: false,
  loading: () => <Loader />,
});

const ClientWrapper: ReadonlyFC = () => {
  return <RestClient />;
};

export default ClientWrapper;
