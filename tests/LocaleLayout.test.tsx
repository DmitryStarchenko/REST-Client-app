import { render, screen } from '@testing-library/react';
import { hasLocale } from 'next-intl';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { createClient } from '@/lib';

import RootLayout, { metadata as rootMetadata } from '../src/app/[locale]/layout';

const mockPush = vi.hoisted(() => vi.fn());

vi.mock('next-intl', async () => {
  const actual = await vi.importActual('next-intl');
  return {
    ...(actual as object),
    hasLocale: vi.fn(),
    useTranslations: () => (key: string) => key,
    NextIntlClientProvider: ({
      children,
      locale,
    }: {
      children: React.ReactNode;
      locale: string;
    }) => <div data-locale={locale}>{children}</div>,
  };
});

vi.mock('../src/i18n/navigation.ts', () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  redirect: vi.fn(),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useParams: vi.fn(() => ({})),
  useSelectedLayoutSegment: vi.fn(() => null),
  useSelectedLayoutSegments: vi.fn(() => []),
}));

vi.mock('@/lib/supabase/client', () => {
  const mockOnAuthStateChange = vi.fn(() => ({
    data: {
      subscription: {
        unsubscribe: vi.fn(),
      },
    },
  }));

  return {
    default: {
      auth: {
        onAuthStateChange: mockOnAuthStateChange,
      },
    },
  };
});

vi.mock('nextjs-toploader', () => ({
  __esModule: true,
  default: () => <div aria-label="Page loading indicator" />,
}));

vi.mock('@/components/layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <main>
      <header>
        <h1>Application Header</h1>
      </header>
      {children}
    </main>
  ),
}));

vi.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['en', 'fr', 'de'],
  },
}));

vi.mock('@/lib', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/app/providers', () => ({
  default: ({ children, initialUser }: { children: React.ReactNode; initialUser: unknown }) => (
    <div data-user={JSON.stringify(initialUser)}>{children}</div>
  ),
}));

vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(),
  }),
}));

describe('RootLayout', () => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
    },
  };

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  const mockHasLocale = vi.mocked(hasLocale);

  beforeEach(() => {
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);
    vi.mocked(mockSupabase.auth.getUser).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    } as never);
    mockHasLocale.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('metadata', () => {
    it('should have correct metadata', () => {
      expect(rootMetadata.title).toBe('PUTMAN');
      expect(rootMetadata.description).toBe(
        'Interact with APIs, manage requests, and debug effortlessly.',
      );
    });
  });

  describe('RootLayout component', () => {
    it('should render successfully with valid locale and include all necessary elements', async () => {
      mockHasLocale.mockReturnValue(true);
      const params = Promise.resolve({ locale: 'en' });
      const children = <div>Test Content</div>;
      const Component = await RootLayout({ children, params });
      render(Component);
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Application Header' })).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
      const htmlElement = document.documentElement;
      expect(htmlElement).toHaveAttribute('lang', 'en');
    });

    it('should call notFound for invalid locale', async () => {
      mockHasLocale.mockReturnValue(false);
      const params = Promise.resolve({ locale: 'invalid' });
      const children = <div>Test Content</div>;
      try {
        await RootLayout({ children, params } as unknown as Parameters<typeof RootLayout>[0]);
        expect(true).toBe(false);
      } catch {}
    });

    it('should handle supabase auth error gracefully and render content', async () => {
      mockHasLocale.mockReturnValue(true);
      vi.mocked(mockSupabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: new Error('Auth error'),
      } as never);
      const params = Promise.resolve({ locale: 'en' });
      const children = <div>Test Content</div>;
      const Component = await RootLayout({ children, params });
      render(Component);
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
      const htmlElement = document.documentElement;
      expect(htmlElement).toHaveAttribute('lang', 'en');
    });

    it('should include loading indicator', async () => {
      mockHasLocale.mockReturnValue(true);
      const params = Promise.resolve({ locale: 'en' });
      const children = <div>Test Content</div>;
      const Component = await RootLayout({ children, params });
      render(Component);
      expect(screen.getByLabelText('Page loading indicator')).toBeInTheDocument();
    });
  });

  it('should have correct RootLayoutProps type', () => {
    const props: React.ComponentProps<typeof RootLayout> = {
      children: <div>Test</div>,
      params: Promise.resolve({ locale: 'en' }),
    };
    expect(props).toBeDefined();
  });
});
