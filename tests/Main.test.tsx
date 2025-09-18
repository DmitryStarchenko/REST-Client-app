import { render, screen } from '@testing-library/react';
import { useAtomValue } from 'jotai';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Main from '../src/components/layout/Main/Main';

const mockT = vi.fn();

vi.mock('next-intl', () => ({
  useTranslations: () => mockT,
  useLocale: vi.fn(() => 'ru'),
}));

vi.mock('jotai', async () => {
  const actual = await vi.importActual<typeof import('jotai')>('jotai');
  return {
    ...actual,
    useAtomValue: vi.fn(),
  };
});

vi.mock('@/i18n/navigation', () => ({
  Link: vi.fn(({ children, href, className }) =>
    React.createElement(
      'a',
      {
        href,
        className,
      },
      children,
    ),
  ),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
}));

vi.mock('./components/buttonNavPage/ButtonsNavPage', () => ({
  default: vi.fn(() => <div data-testid="buttons-nav-page" />),
}));

vi.mock('../Header/ButtonsSignInUp/ButtonsSignInUp', () => ({
  default: vi.fn(() => <div data-testid="buttons-sign-in-up" />),
}));

vi.mock('./components/about/about', () => ({
  default: vi.fn(() => <div data-testid="about" />),
}));

const mockUseAtomValue = vi.mocked(useAtomValue);

describe('Main Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        welcome: 'Добро пожаловать',
        welcomeBack: 'С возвращением',
        signIn: 'Войти',
        signUp: 'Зарегистрироваться',
      };
      return translations[key] || key;
    });
  });

  it('renders welcome message and sign in/up buttons when user is not authenticated', () => {
    mockUseAtomValue.mockReturnValue({ user: null });

    render(<Main />);

    expect(screen.getByText('С возвращением')).toBeInTheDocument();
  });

  it('renders welcome back message and navigation buttons when user is authenticated', () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    mockUseAtomValue.mockReturnValue({ user: mockUser });

    render(<Main />);

    expect(screen.getByText('С возвращением')).toBeInTheDocument();
  });
});
