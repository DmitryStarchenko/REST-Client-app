import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import React from 'react';
import { useTransition } from 'react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import LangSwitcher from '../src/components/layout/LangSwitcher/LangSwitcher';

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useLocale: vi.fn(),
}));

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useTransition: vi.fn(),
  };
});

vi.mock('@/i18n/navigation', () => ({
  useRouter: vi.fn(() => ({
    replace: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
}));

vi.mock('@/i18n/routing', () => ({
  locales: ['en', 'ru'],
}));

vi.mock('@/types/lang.types', () => ({
  Lang: {
    en: 'en',
    ru: 'ru',
  },
}));

const mockUseTransition = useTransition as Mock;
const mockUseLocale = useLocale as Mock;
const mockUseSearchParams = useSearchParams as Mock;
const mockUsePathname = usePathname as Mock;
const mockUseRouter = useRouter as Mock;

describe('LangSwitcher', () => {
  const mockReplace = vi.fn();
  const mockStartTransition = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseTransition.mockReturnValue([false, mockStartTransition]);
    mockUseRouter.mockReturnValue({
      replace: mockReplace,
    });
    mockUsePathname.mockReturnValue('/');
    mockUseSearchParams.mockReturnValue({
      toString: () => '',
    });
  });

  it('renders current locale button text correctly for EN', () => {
    mockUseLocale.mockReturnValue('en');
    render(<LangSwitcher />);
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('renders current locale button text correctly for RU', () => {
    mockUseLocale.mockReturnValue('ru');
    render(<LangSwitcher />);
    expect(screen.getByText('RU')).toBeInTheDocument();
  });

  it('renders uppercase locale for unknown locales', () => {
    mockUseLocale.mockReturnValue('fr');
    render(<LangSwitcher />);
    expect(screen.getByText('FR')).toBeInTheDocument();
  });

  it('switches to next language on button click', async () => {
    mockUseLocale.mockReturnValue('en');
    mockUsePathname.mockReturnValue('/test');
    mockUseSearchParams.mockReturnValue({
      toString: () => '?param=value',
    });
    render(<LangSwitcher />);
    const button = screen.getByText('EN');
    await userEvent.click(button);
    expect(mockStartTransition).toHaveBeenCalled();
  });

  it('uses startTransition for router replacement', async () => {
    mockUseLocale.mockReturnValue('en');
    render(<LangSwitcher />);
    await userEvent.click(screen.getByText('EN'));

    expect(mockStartTransition).toHaveBeenCalledTimes(1);
    const callback = mockStartTransition.mock.calls[0][0];
    expect(typeof callback).toBe('function');
  });
});
