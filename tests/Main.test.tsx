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

vi.mock('../src/components/layout/Main/components/buttonNavPage/ButtonsNavPage', () => ({
  default: vi.fn(() => <div data-testid="buttons-nav-page" />),
}));

vi.mock('../src/components/layout/Header/ButtonsSignInUp/ButtonsSignInUp', () => ({
  default: vi.fn(() => <div data-testid="buttons-sign-in-up" />),
}));

vi.mock('../src/components/layout/Main/components/about/About', () => ({
  default: vi.fn(() => <div data-testid="about" />),
}));

const mockUseAtomValue = vi.mocked(useAtomValue);

describe('Main Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockT.mockImplementation((key) => {
      const translations: Record<string, string> = {
        welcomeBack: 'С возвращением',
        welcome: 'Добро пожаловать',
      };
      return translations[key] || key;
    });
  });

  it('renders welcome message and sign in/up buttons when user is not authenticated', () => {
    mockUseAtomValue.mockReturnValue(null);

    render(<Main />);

    expect(screen.getByText('Добро пожаловать')).toBeInTheDocument();
    expect(screen.getByTestId('buttons-sign-in-up')).toBeInTheDocument();
    expect(screen.queryByTestId('buttons-nav-page')).not.toBeInTheDocument();
  });

  it('renders welcome back message and navigation buttons when user is authenticated', () => {
    const mockUser = {
      user: {
        id: '1',
        name: 'Test User',
        email: 'testuser@example.com',
      },
    };
    mockUseAtomValue.mockReturnValue(mockUser);

    render(<Main />);

    expect(screen.getByText('С возвращением, testuser')).toBeInTheDocument();
    expect(screen.getByTestId('buttons-nav-page')).toBeInTheDocument();
    expect(screen.queryByTestId('buttons-sign-in-up')).not.toBeInTheDocument();
  });

  it('renders About component in both cases', () => {
    mockUseAtomValue.mockReturnValue(null);

    render(<Main />);

    expect(screen.getByTestId('about')).toBeInTheDocument();
  });
});
