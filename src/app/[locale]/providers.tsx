'use client';

import { InitColorSchemeScript, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Session } from '@supabase/supabase-js';
import { QueryClientProvider } from '@tanstack/react-query';
import { createStore } from 'jotai';
import { Provider as JotaiProvider } from 'jotai';
import React, { useEffect } from 'react';

import supabaseClient from '@/lib/supabase/client';
import { authAtom } from '@/store';
import { theme, MonacoThemeProvider } from '@/theme';
import { ReadonlyFC } from '@/types';
import getQueryClient from '@/utils/get-query-client';

interface ProvidersProps {
  children: React.ReactNode;
  initialSession: Session | null;
}

const Providers: ReadonlyFC<ProvidersProps> = ({ children, initialSession }) => {
  const queryClient = getQueryClient();
  const store = createStore();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      store.set(authAtom, session);
    });

    return () => subscription.unsubscribe();
  }, [store]);

  if (initialSession) {
    store.set(authAtom, initialSession);
  }

  return (
    <AppRouterCacheProvider>
      <JotaiProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <InitColorSchemeScript attribute="data" />
          <ThemeProvider theme={theme}>
            <MonacoThemeProvider />
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </JotaiProvider>
    </AppRouterCacheProvider>
  );
};

export default Providers;
