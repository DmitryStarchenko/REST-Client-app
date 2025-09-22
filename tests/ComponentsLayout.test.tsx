import { render, screen } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';

import Layout from '../src/components/layout/Layout';

const mockPush = vi.hoisted(() => vi.fn());
const mockSignUp = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  useSelectedLayoutSegment: () => null,
  useSelectedLayoutSegments: () => [],
}));

interface LinkProps {
  children: ReactNode;
  href: string;
  className?: string;
}

vi.mock('../src/i18n/navigation', () => {
  const Link = ({ children, href, className }: LinkProps): ReactNode => (
    <a href={href} className={className}>
      {children}
    </a>
  );

  return {
    Link,
    redirect: vi.fn(),
    useRouter: () => ({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
    useSelectedLayoutSegment: () => null,
    useSelectedLayoutSegments: () => [],
  };
});

vi.mock('../src/lib/supabase/client', () => ({
  default: {
    auth: {
      signUp: mockSignUp,
    },
  },
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
  useNow: () => new Date(),
}));

vi.mock('../src/components/layout/Header/Header', () => ({
  default: vi.fn(() => <header data-testid="header">Header</header>),
}));

vi.mock('../src/components/layout/Footer/Footer', () => ({
  default: vi.fn(() => <footer data-testid="footer">Footer</footer>),
}));

describe('Layout', () => {
  it('рендерит Header, переданных детей и Footer', () => {
    const testContent = 'Test Content';
    render(
      <Layout>
        <div>{testContent}</div>
      </Layout>,
    );
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText(testContent)).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('рендерит без ошибок с пустыми детьми', () => {
    expect(() => {
      render(<Layout>{null}</Layout>);
    }).not.toThrow();
  });

  it('рендерит без ошибок с фрагментом как детьми', () => {
    expect(() => {
      render(
        <Layout>
          <>Test Fragment</>
        </Layout>,
      );
    }).not.toThrow();
  });
});
