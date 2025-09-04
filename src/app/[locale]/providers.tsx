'use client';
import { InitColorSchemeScript, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import Layout from '@/components/layout/Layout';
import { theme } from '@/theme/theme';
import { ReadonlyFC } from '@/types/readonly.types';
import getQueryClient from '@/utils/get-query-client';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: ReadonlyFC<ProvidersProps> = ({ children }) => {
  const queryClient = getQueryClient();

  return (
    <AppRouterCacheProvider>
      <QueryClientProvider client={queryClient}>
        <InitColorSchemeScript attribute="data" />
        <ThemeProvider theme={theme}>
          <Layout>{children}</Layout>
        </ThemeProvider>
      </QueryClientProvider>
    </AppRouterCacheProvider>
  );
};

export default Providers;
