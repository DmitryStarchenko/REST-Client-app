'use client'; // Error boundaries must be Client Components

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import CustomErrorPage from '@/components/shared/ErrorPage/ErrorPage';
import { ReadonlyFC } from '@/types/readonly.types';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage: ReadonlyFC<ErrorPageProps> = ({ error, reset }) => {
  const t = useTranslations('ErrorPage');

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <CustomErrorPage title={t('title')} message={error.message}>
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          {t('Try again')}
        </button>
      </CustomErrorPage>
    </div>
  );
};

export default ErrorPage;
