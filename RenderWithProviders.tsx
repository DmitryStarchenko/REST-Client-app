import { Session } from 'inspector/promises';

import { ThemeProvider, InitColorSchemeScript } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider as JotaiProvider, createStore } from 'jotai';
import { NextIntlClientProvider } from 'next-intl';
import React, { useEffect } from 'react';
import { vi } from 'vitest';

import BodyBlock from '@/components/client/TopSection';
import supabaseClient from '@/lib/supabase/client';
import { authAtom } from '@/store';
import { theme, MonacoThemeProvider } from '@/theme';
import { Header } from '@/types';
import { encodeBase64 } from '@/utils';
import getQueryClient from '@/utils/get-query-client';

vi.mock('@/components/client/Shared/CodeEditor', () => ({
  CodeEditor: vi.fn(({ value, onChange }) => (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} />
  )),
}));

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ data: [], error: null }),
  }),
}));

const messages = {
  BodyBlock: {
    'Copy base64': 'Copy base64',
    'Invalid JSON': 'Invalid JSON',
  },
};

const RenderWithProviders = (component: React.ReactNode, initialSession: Session | null = null) => {
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

  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <AppRouterCacheProvider>
        <JotaiProvider store={store}>
          <QueryClientProvider client={queryClient}>
            <InitColorSchemeScript attribute="data" />
            <ThemeProvider theme={theme}>
              <MonacoThemeProvider />
              {component}
            </ThemeProvider>
          </QueryClientProvider>
        </JotaiProvider>
      </AppRouterCacheProvider>
    </NextIntlClientProvider>,
  );
};

describe('BodyBlock', () => {
  const setBodyTextMock = vi.fn();

  it('renders correctly with initial state', () => {
    RenderWithProviders(
      <BodyBlock
        bodyText=""
        setBodyText={setBodyTextMock}
        headers={[]}
        setHeaders={function (_headers: Header[]): void {
          throw new Error('Function not implemented.');
        }}
        method={''}
        url={''}
      />,
    );

    expect(screen.getByTestId('copy-base64-button')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('changes body type to XML', async () => {
    RenderWithProviders(
      <BodyBlock
        bodyText=""
        setBodyText={setBodyTextMock}
        headers={[]}
        setHeaders={function (_headers: Header[]): void {
          throw new Error('Function not implemented.');
        }}
        method={''}
        url={''}
      />,
    );

    const select = screen.getByTestId('select-body-type');
    fireEvent.change(select, { target: { value: 'XML' } });

    expect(select).toHaveValue('XML');
  });

  it('copies base64 encoded text to clipboard', async () => {
    const bodyText = 'Hello World!';
    RenderWithProviders(
      <BodyBlock
        bodyText={bodyText}
        setBodyText={setBodyTextMock}
        headers={[]}
        setHeaders={function (_headers: Header[]): void {
          throw new Error('Function not implemented.');
        }}
        method={''}
        url={''}
      />,
    );

    const copyButton = screen.getByTestId('copy-base64-button');
    const encodeSpy = vi.spyOn(window.navigator.clipboard, 'writeText');

    fireEvent.click(copyButton);

    expect(encodeSpy).toHaveBeenCalledWith(encodeBase64(bodyText));
  });

  it('shows an error when bodyText is invalid JSON', async () => {
    const invalidJson = '{"name": "John",}';
    RenderWithProviders(
      <BodyBlock
        bodyText={invalidJson}
        setBodyText={setBodyTextMock}
        headers={[]}
        setHeaders={function (_headers: Header[]): void {
          throw new Error('Function not implemented.');
        }}
        method={''}
        url={''}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/Invalid JSON/i)).toBeInTheDocument();
    });
  });

  it('does not show an error for valid JSON', async () => {
    const validJson = '{"name": "John"}';
    RenderWithProviders(
      <BodyBlock
        bodyText={validJson}
        setBodyText={setBodyTextMock}
        headers={[]}
        setHeaders={function (_headers: Header[]): void {
          throw new Error('Function not implemented.');
        }}
        method={''}
        url={''}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText('Invalid JSON')).toBeNull();
    });
  });
});
