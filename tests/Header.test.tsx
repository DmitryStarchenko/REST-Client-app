import { render, screen, fireEvent } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let Header: React.ComponentType;

vi.mock('jotai', async (importOriginal) => {
  const actual = await importOriginal<typeof import('jotai')>();
  return {
    ...actual,
    useAtomValue: vi.fn(() => ({ user: null })),
  };
});

vi.mock('@/lib/supabase/client', () => ({
  default: {
    auth: {
      signOut: vi.fn(),
    },
  },
}));

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
  useLocale: vi.fn(() => 'ru'),
}));

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signOut: vi.fn(),
    },
  })),
}));

vi.mock('@/i18n/navigation', () => ({
  Link: vi.fn(({ children, href, className, onClick }) =>
    React.createElement(
      'a',
      {
        href,
        className,
        onClick,
        'data-testid': `link-${href}`,
      },
      children,
    ),
  ),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
}));

vi.mock('../LangSwitcher/LangSwitcher', () => ({
  default: vi.fn(() =>
    React.createElement('div', { 'data-testid': 'lang-switcher' }, 'LangSwitcher'),
  ),
}));

vi.mock('../ThemeToggler/ThemeToggler', () => ({
  default: vi.fn(() =>
    React.createElement('div', { 'data-testid': 'theme-toggler' }, 'ThemeToggler'),
  ),
}));

vi.mock('./ButtonsSignInUp/ButtonsSignInUp', () => ({
  default: vi.fn(() =>
    React.createElement('div', { 'data-testid': 'buttons-signinup' }, 'ButtonsSignInUp'),
  ),
}));

vi.mock('../Main/components/ButtonNavPage/ButtonsNavPage', () => ({
  default: vi.fn(() =>
    React.createElement('div', { 'data-testid': 'buttons-navpage' }, 'ButtonsNavPage'),
  ),
}));

type MockFunction = ReturnType<typeof vi.fn>;

describe('Header', async () => {
  const mockT = vi.fn();
  const originalJotai = await vi.importActual('jotai');

  beforeEach(async () => {
    vi.resetModules();
    vi.doMock('jotai', () => ({
      ...originalJotai,
      useAtomValue: vi.fn(() => ({ user: null })),
    }));

    Header = (await import('../src/components/layout/Header/Header')).default;

    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        signIn: 'Войти',
        signUp: 'Регистрация',
        main: 'Главная',
        signOut: 'Выйти',
      };
      return translations[key] || key;
    });

    (useTranslations as MockFunction).mockReturnValue(mockT);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders all the main elements', () => {
    render(<Header />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('adds and removes compact class on scroll', () => {
    const { container } = render(<Header />);

    const header = container.firstChild as HTMLElement;

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);
    expect(header.className).toContain('header');
    expect(header.className).toContain('headerCompact');

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    fireEvent.scroll(window);
    expect(header.className).toContain('header');
    expect(header.className).not.toContain('headerCompact');
  });

  it('renders main, nav page buttons and sign out links when user is authenticated', async () => {
    vi.doMock('jotai', () => ({
      ...originalJotai,
      useAtomValue: vi.fn(() => ({ user: { id: '1', email: 'test@example.com' } })),
    }));

    vi.resetModules();
    Header = (await import('../src/components/layout/Header/Header')).default;

    render(<Header />);

    expect(screen.getByText('Главная')).toBeInTheDocument();
    expect(screen.getByText('Выйти')).toBeInTheDocument();
  });

  it('calls signOut when sign out link is clicked', async () => {
    const mockSignOut = vi.fn();
    vi.doMock('@/lib/supabase/client', () => ({
      default: {
        auth: {
          signOut: mockSignOut,
        },
      },
    }));

    vi.doMock('jotai', () => ({
      ...originalJotai,
      useAtomValue: vi.fn(() => ({ user: { id: '1', email: 'test@example.com' } })),
    }));

    vi.resetModules();
    Header = (await import('../src/components/layout/Header/Header')).default;

    render(<Header />);

    const signOutLink = screen.getByText('Выйти');
    fireEvent.click(signOutLink);

    expect(mockSignOut).toHaveBeenCalled();
  });

  it('does not render auth links when user is authenticated', async () => {
    vi.doMock('jotai', () => ({
      ...originalJotai,
      useAtomValue: vi.fn(() => ({ user: { id: '1', email: 'test@example.com' } })),
    }));

    vi.resetModules();
    Header = (await import('../src/components/layout/Header/Header')).default;

    render(<Header />);

    expect(screen.queryByTestId('buttons-signinup')).not.toBeInTheDocument();
  });
});
