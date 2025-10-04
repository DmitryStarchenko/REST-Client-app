import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import ButtonsNavPage from '../src/components/layout/Main/components/ButtonNavPage/ButtonsNavPage';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('@/i18n/navigation', () => ({
  Link: vi.fn(({ children, href, className }) => (
    <a href={href} className={className} data-testid={`link-${href.replace('/', '')}`}>
      {children}
    </a>
  )),
}));

describe('ButtonsNavPage', () => {
  const mockTranslation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslations as ReturnType<typeof vi.fn>).mockReturnValue(mockTranslation);
  });

  it('should display all navigation links with correct translations', () => {
    mockTranslation.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        client: 'Клиент',
        variables: 'Переменные',
        history: 'История',
      };
      return translations[key] || key;
    });
    render(<ButtonsNavPage />);
    expect(useTranslations).toHaveBeenCalledWith('Main');
    const clientLink = screen.getByTestId('link-client');
    const variablesLink = screen.getByTestId('link-variables');
    const historyLink = screen.getByTestId('link-history');

    expect(clientLink).toBeInTheDocument();
    expect(variablesLink).toBeInTheDocument();
    expect(historyLink).toBeInTheDocument();
    expect(clientLink).toHaveAttribute('href', '/client');
    expect(variablesLink).toHaveAttribute('href', '/variables');
    expect(historyLink).toHaveAttribute('href', '/history');
    expect(clientLink).toHaveTextContent('Клиент');
    expect(variablesLink).toHaveTextContent('Переменные');
    expect(historyLink).toHaveTextContent('История');
    expect(mockTranslation).toHaveBeenCalledWith('client');
    expect(mockTranslation).toHaveBeenCalledWith('variables');
    expect(mockTranslation).toHaveBeenCalledWith('history');
  });

  it('must use the correct translation keys even if no translations are found', () => {
    mockTranslation.mockImplementation((key: string) => key);
    render(<ButtonsNavPage />);
    expect(screen.getByTestId('link-client')).toHaveTextContent('client');
    expect(screen.getByTestId('link-variables')).toHaveTextContent('variables');
    expect(screen.getByTestId('link-history')).toHaveTextContent('history');
  });

  it('should render the correct number of links', () => {
    mockTranslation.mockImplementation((key: string) => key);
    render(<ButtonsNavPage />);
    const links = screen.getAllByTestId(/^link-/);
    expect(links).toHaveLength(3);
  });
});
