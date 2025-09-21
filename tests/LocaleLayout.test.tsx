import type { Session } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import React, { ReactElement } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { routing } from '@/i18n/routing';
import { getValidatedClientSession } from '@/lib/supabase/session';

import RootLayout from '../src/app/[locale]/layout';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('next-intl', async () => {
  const actual = await vi.importActual('next-intl');
  return {
    ...actual,
    hasLocale: vi.fn(),
    NextIntlClientProvider: vi.fn(
      ({ children, locale }: { children: React.ReactNode; locale: string }) => (
        <div data-testid="next-intl-provider" data-locale={locale}>
          {children}
        </div>
      ),
    ),
  };
});

vi.mock('@/components/layout/Layout', () => ({
  default: vi.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  )),
}));

vi.mock('@/app/providers', () => ({
  default: vi.fn(
    ({
      children,
      initialSession,
    }: {
      children: React.ReactNode;
      initialSession: Session | null;
    }) => (
      <div data-testid="providers" data-session={JSON.stringify(initialSession)}>
        {children}
      </div>
    ),
  ),
}));

vi.mock('../src/lib/supabase/client', () => ({
  default: {
    auth: {
      signUp: vi.fn(),
    },
  },
}));

vi.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['en', 'ru'],
  },
}));

vi.mock('@/lib/supabase/session', () => ({
  getValidatedClientSession: vi.fn(),
}));

describe('RootLayout', () => {
  const mockChildren = <div data-testid="test-children">Test Content</div>;
  const mockSession: Session = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    user: {
      id: '123',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    },
  };

  beforeEach(async () => {
    vi.mocked(getValidatedClientSession).mockResolvedValue(mockSession);
    vi.mocked(hasLocale).mockReturnValue(true);
    vi.mocked(notFound).mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render successfully with valid locale', async () => {
    const params = Promise.resolve({ locale: 'en' });
    const props = {
      children: mockChildren,
      params,
    };

    const result = await RootLayout(props);
    expect(result).toBeDefined();
    expect(hasLocale).toHaveBeenCalledWith(routing.locales, 'en');
    expect(notFound).not.toHaveBeenCalled();
  });

  it('should call notFound for invalid locale', async () => {
    vi.mocked(hasLocale).mockReturnValue(false);
    const params = Promise.resolve({ locale: 'invalid' });
    const props = {
      children: mockChildren,
      params,
    };

    try {
      await RootLayout(props);
    } catch {}

    expect(hasLocale).toHaveBeenCalledWith(routing.locales, 'invalid');
    expect(notFound).toHaveBeenCalled();
  });

  it('should render with correct HTML attributes', async () => {
    const params = Promise.resolve({ locale: 'ru' });
    const props = {
      children: mockChildren,
      params,
    };

    const result = (await RootLayout(props)) as ReactElement;

    expect(result.type).toBe('html');
  });

  it('should handle session retrieval', async () => {
    const params = Promise.resolve({ locale: 'en' });
    const props = {
      children: mockChildren,
      params,
    };

    await RootLayout(props);
    expect(getValidatedClientSession).toHaveBeenCalled();
  });
});
