import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import NotFoundPage from '../src/app/[locale]/not-found';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('@/components/shared/ErrorPage/ErrorPage', () => ({
  default: vi.fn(({ title, message }: { title: string; message: string }) => (
    <div data-testid="error-page">
      <h1 data-testid="error-title">{title}</h1>
      <p data-testid="error-message">{message}</p>
    </div>
  )),
}));

describe('NotFoundPage', () => {
  const mockT = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        title: 'Page Not Found',
        message: 'The page you are looking for does not exist.',
      };
      return translations[key] || key;
    });
    (useTranslations as ReturnType<typeof vi.fn>).mockReturnValue(mockT);
  });

  it('should render without crashing', () => {
    render(<NotFoundPage />);

    expect(screen.getByTestId('error-page')).toBeInTheDocument();
  });

  it('should call useTranslations with correct namespace', () => {
    render(<NotFoundPage />);

    expect(useTranslations).toHaveBeenCalledWith('NotFoundPage');
  });

  it('should render translated title and message', () => {
    render(<NotFoundPage />);

    expect(screen.getByTestId('error-title')).toHaveTextContent('Page Not Found');
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'The page you are looking for does not exist.',
    );
  });

  it('should call translation function for title and message keys', () => {
    render(<NotFoundPage />);

    expect(mockT).toHaveBeenCalledWith('title');
    expect(mockT).toHaveBeenCalledWith('message');
  });

  it('should handle missing translations gracefully', () => {
    mockT.mockImplementation((key: string) => key);

    render(<NotFoundPage />);

    expect(screen.getByTestId('error-title')).toHaveTextContent('title');
    expect(screen.getByTestId('error-message')).toHaveTextContent('message');
  });
});
