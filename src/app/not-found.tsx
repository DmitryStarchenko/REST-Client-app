'use client';
import React from 'react';

import ErrorPage from '@/components/shared/ErrorPage/ErrorPage';
import { ReadonlyFC } from '@/types/readonly.types';

const GlobalNotFound: ReadonlyFC = () => {
  return (
    <html lang="en">
      <body>
        <ErrorPage title="Not Found!" message="Could not find resource" />
      </body>
    </html>
  );
};

export default GlobalNotFound;
