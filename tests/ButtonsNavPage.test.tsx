import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import ButtonsNavPage from '../src/components/layout/Main/components/ButtonNavPage/ButtonsNavPage';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: vi.fn(({ children, href, className }) => (
    <a href={href} className={className}>
      {children}
    </a>
  )),
}));

vi.mock('@/i18n/navigation', () => ({
  Link: vi.fn(({ children, href, className }) => (
    <a href={href} className={className}>
      {children}
    </a>
  )),
}));

vi.mock('./ButtonsNavPage.module.css', () => ({
  default: {
    navButton: 'navButton-class',
  },
}));

describe('ButtonsNavPage', () => {
  const mockTranslation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockTranslation.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        client: 'Client Page',
        variables: 'Variables Page',
        history: 'History Page',
      };
      return translations[key] || key;
    });

    (useTranslations as Mock).mockReturnValue(mockTranslation);
  });

  it('should render all navigation buttons with correct text and links', () => {
    render(<ButtonsNavPage />);
    const clientLink = screen.getByRole('link', { name: 'Client Page' });
    const variablesLink = screen.getByRole('link', { name: 'Variables Page' });
    const historyLink = screen.getByRole('link', { name: 'History Page' });

    expect(clientLink).toBeInTheDocument();
    expect(clientLink).toHaveAttribute('href', '/client');
    expect(variablesLink).toBeInTheDocument();
    expect(variablesLink).toHaveAttribute('href', '/variables');
    expect(historyLink).toBeInTheDocument();
    expect(historyLink).toHaveAttribute('href', '/history');
  });

  it('should call useTranslations with correct namespace', () => {
    render(<ButtonsNavPage />);
    expect(useTranslations).toHaveBeenCalledWith('Main');
  });

  it('should call translation function with correct keys', () => {
    render(<ButtonsNavPage />);
    expect(mockTranslation).toHaveBeenCalledWith('client');
    expect(mockTranslation).toHaveBeenCalledWith('variables');
    expect(mockTranslation).toHaveBeenCalledWith('history');
    expect(mockTranslation).toHaveBeenCalledTimes(3);
  });

  // it('should match snapshot', () => {
  //   const { container } = render(<ButtonsNavPage />);
  //   expect(container).toMatchSnapshot();
  // });
});
