'use client';

import { Suspense } from 'react';

import { ReadonlyFC } from '@/types';

import RestClient from './RestClient';

const RestClientWrapper: ReadonlyFC = () => (
  <Suspense fallback={<div>Loading REST client…</div>}>
    <RestClient />
  </Suspense>
);

export default RestClientWrapper;
