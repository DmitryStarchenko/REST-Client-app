import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { User } from '@supabase/supabase-js';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { createStore } from 'jotai';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import getQueryClient from '@/utils/get-query-client';

import { createMockQueryClient } from './utils/mock-query-client';
import Providers from '../src/app/[locale]/providers';

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    InitColorSchemeScript: vi.fn(() => <div data-testid="color-scheme-script" />),
    ThemeProvider: vi.fn(({ children }) => <div>{children}</div>),
  };
});

vi.mock('@mui/material-nextjs/v15-appRouter', () => ({
  AppRouterCacheProvider: vi.fn(({ children }) => <div>{children}</div>),
}));

vi.mock('@tanstack/react-query', () => ({
  QueryClientProvider: vi.fn(({ children }) => <div>{children}</div>),
}));

vi.mock('jotai', async () => {
  const actual = await vi.importActual('jotai');
  return {
    ...actual,
    createStore: vi.fn(),
    Provider: vi.fn(({ children }) => <div>{children}</div>),
  };
});

vi.mock('@/lib/supabase/client', () => ({
  default: {
    auth: {
      onAuthStateChange: vi.fn(() => ({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      })),
    },
  },
}));

vi.mock('@/theme', () => ({
  theme: {},
  MonacoThemeProvider: vi.fn(() => <div data-testid="monaco-provider" />),
}));

vi.mock('@/utils/get-query-client', () => ({
  default: vi.fn(),
}));

vi.mock('@/store', () => ({
  authAtom: Symbol('authAtom'),
}));

describe('Providers', () => {
  const mockUser: User = {
    id: 'user-id',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2023-01-01',
  };

  const mockStore = {
    set: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(getQueryClient).mockReturnValue(createMockQueryClient());
    vi.mocked(createStore).mockReturnValue(mockStore as unknown as ReturnType<typeof createStore>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render children with all providers', () => {
    render(
      <Providers initialUser={null}>
        <div data-testid="test-child">Test Child</div>
      </Providers>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByTestId('color-scheme-script')).toBeInTheDocument();
    expect(screen.getByTestId('monaco-provider')).toBeInTheDocument();
  });

  it('should set initial user when provided', () => {
    render(
      <Providers initialUser={mockUser}>
        <div>Test</div>
      </Providers>,
    );

    expect(mockStore.set).toHaveBeenCalledWith(authAtom, mockUser);
  });

  it('should not set initial user when null', () => {
    render(
      <Providers initialUser={null}>
        <div>Test</div>
      </Providers>,
    );

    expect(mockStore.set).not.toHaveBeenCalledWith(authAtom, mockUser);
  });

  it('should wrap children with all provider components', () => {
    render(
      <Providers initialUser={null}>
        <div>Test</div>
      </Providers>,
    );

    expect(AppRouterCacheProvider).toHaveBeenCalled();
    expect(JotaiProvider).toHaveBeenCalled();
    expect(QueryClientProvider).toHaveBeenCalled();
  });
});
