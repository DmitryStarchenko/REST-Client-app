import { render, screen, fireEvent } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import Header from '../components/layout/Header/Header';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
  useLocale: vi.fn(() => 'ru'),
  useNow: vi.fn(() => new Date()),
  useTimeZone: vi.fn(() => 'UTC'),
}));

vi.mock('@/i18n/navigation', () => ({
  Link: vi.fn(({ children, href, className }) =>
    React.createElement(
      'a',
      {
        href,
        className,
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
  default: vi.fn(() => React.createElement('div', 'LangSwitcher')),
}));

vi.mock('../ThemeToggler/ThemeToggler', () => ({
  default: vi.fn(() => React.createElement('div', 'ThemeToggler')),
}));

type MockFunction = ReturnType<typeof vi.fn>;

describe('Header', () => {
  const mockT = vi.fn();

  beforeEach(() => {
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        signIn: 'Войти',
        signUp: 'Регистрация',
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
    expect(screen.getByText('Войти')).toBeInTheDocument();
    expect(screen.getByText('Регистрация')).toBeInTheDocument();
    expect(screen.getByText('Выйти')).toBeInTheDocument();
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
});
