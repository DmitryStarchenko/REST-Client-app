'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import React from 'react';

import CustomErrorPage from '@/components/shared/ErrorPage/ErrorPage';
import { ReadonlyFC } from '@/types/readonly.types';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage: ReadonlyFC<ErrorPageProps> = ({ error, reset }) => {
  const t = useTranslations('ErrorPage');

  useEffect(() => {}, [error]);

  return (
    <div>
      <CustomErrorPage title={t('title')} message={error.message}>
        <button onClick={() => reset()}>{t('Try again')}</button>
      </CustomErrorPage>
    </div>
  );
};

export default ErrorPage;
