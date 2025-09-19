'use client';

import dynamic from 'next/dynamic';

import Loader from '@/components/shared/Loader/Loader';
import { ReadonlyFC } from '@/types';

const RestClientWrapper = dynamic(() => import('@/components/client'), {
  ssr: false,
  loading: () => <Loader />,
});

const ClientIndex: ReadonlyFC = () => <RestClientWrapper />;

export default ClientIndex;
