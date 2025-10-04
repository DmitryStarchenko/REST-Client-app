import { notFound } from 'next/navigation';
import React from 'react';

import ClientWrapper from '@/components/client';
import { ReadonlyFC, PageProps } from '@/types';
import { isValidMethod } from '@/utils';

const MethodPage: ReadonlyFC<PageProps> = async ({ params }) => {
  const { method } = await params;
  const methodUpper = (method ?? '').toUpperCase();

  if (!isValidMethod(methodUpper)) {
    notFound();
  }
  return <ClientWrapper />;
};

export default MethodPage;
