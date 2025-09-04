'use client';

import ErrorPage from '@/components/shared/ErrorPage/ErrorPage';
import { ReadonlyFC } from '@/types/readonly.types';

// This page renders when a route like `/unknown.txt` is requested.
// In this case, the layout at `app/[locale]/layout.tsx` receives
// an invalid value as the `[locale]` param and calls `notFound()`.

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
