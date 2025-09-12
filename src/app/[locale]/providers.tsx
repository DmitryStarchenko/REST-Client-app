'use client';

import { InitColorSchemeScript, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { User } from '@supabase/supabase-js';
import { QueryClientProvider } from '@tanstack/react-query';
import { createStore } from 'jotai';
import { Provider as JotaiProvider } from 'jotai';
import React, { useEffect } from 'react';

import supabaseClient from '@/lib/supabase/client';
import { authAtom } from '@/store';
import { theme, EditorThemeProvider } from '@/theme';
import { ReadonlyFC } from '@/types';
import getQueryClient from '@/utils/get-query-client';

interface ProvidersProps {
  children: React.ReactNode;
  initialUser: User | null;
}

const Providers: ReadonlyFC<ProvidersProps> = ({ children, initialUser }) => {
  const queryClient = getQueryClient();
  const store = createStore();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      store.set(authAtom, session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [store]);

  if (initialUser) {
    store.set(authAtom, initialUser);
  }

  return (
    <AppRouterCacheProvider>
      <JotaiProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <InitColorSchemeScript attribute="data" />
          <ThemeProvider theme={theme}>
            <EditorThemeProvider />
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </JotaiProvider>
    </AppRouterCacheProvider>
  );
};

export default Providers;
