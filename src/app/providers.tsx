'use client';
import { InitColorSchemeScript, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import React, { FC } from 'react';

import Layout from '@/components/layout/Layout';
import { theme } from '@/theme/theme';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <AppRouterCacheProvider>
      <InitColorSchemeScript attribute="data" />
      <ThemeProvider theme={theme}>
        <Layout>{children}</Layout>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default Providers;
