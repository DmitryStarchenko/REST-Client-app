import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTranslations } from 'next-intl';
import React from 'react';
import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';

import CustomErrorPage from '@/components/shared/ErrorPage/ErrorPage';

import ErrorPage from '../src/app/[locale]/error';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('@/components/shared/ErrorPage/ErrorPage', () => ({
  default: vi.fn(({ children, title, message }) => (
    <div data-testid="custom-error-page">
      <h1>{title}</h1>
      <p>{message}</p>
      {children}
    </div>
  )),
}));

describe('ErrorPage', () => {
  const mockReset = vi.fn();
  const mockUseTranslations = useTranslations as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTranslations.mockReturnValue((key: string) => {
      const translations: Record<string, string> = {
        title: 'Error Occurred',
        'Try again': 'Try Again',
      };
      return translations[key] || key;
    });
  });

  it('should render with error message and translation values', () => {
    const testError = new Error('Test error message');
    render(<ErrorPage error={testError} reset={mockReset} />);
    expect(screen.getByText('Error Occurred')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();

    const button = screen.getByRole('button', { name: 'Try Again' });
    expect(button).toBeInTheDocument();

    const expectedProps = {
      title: 'Error Occurred',
      message: 'Test error message',
      children: expect.any(Object),
    };

    expect(CustomErrorPage).toHaveBeenCalledWith(expectedProps, undefined);
  });

  it('should call reset function when button is clicked', async () => {
    const testError = new Error('Test error');

    render(<ErrorPage error={testError} reset={mockReset} />);

    const button = screen.getByRole('button', { name: 'Try Again' });
    await userEvent.click(button);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('should handle error without digest property', () => {
    const testError = new Error('Simple error');

    render(<ErrorPage error={testError} reset={mockReset} />);

    expect(screen.getByText('Simple error')).toBeInTheDocument();

    const expectedProps = {
      title: 'Error Occurred',
      message: 'Simple error',
      children: expect.any(Object),
    };

    expect(CustomErrorPage).toHaveBeenCalledWith(expectedProps, undefined);
  });

  it('should use translation keys correctly', () => {
    const testError = new Error('Test error');
    const translateMock = vi.fn((key: string) => {
      const translations: Record<string, string> = {
        title: 'Error Occurred',
        'Try again': 'Try Again',
      };
      return translations[key] || key;
    });

    mockUseTranslations.mockReturnValue(translateMock);

    render(<ErrorPage error={testError} reset={mockReset} />);

    expect(mockUseTranslations).toHaveBeenCalledWith('ErrorPage');
    expect(translateMock).toHaveBeenCalledWith('title');
    expect(translateMock).toHaveBeenCalledWith('Try again');
  });

  it('should render button with correct text and onClick handler', () => {
    const testError = new Error('Test error');

    render(<ErrorPage error={testError} reset={mockReset} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Try Again');
    expect(typeof button.onclick).toBe('function');
  });

  it('should pass children to CustomErrorPage', () => {
    const testError = new Error('Test error');

    render(<ErrorPage error={testError} reset={mockReset} />);
    expect(CustomErrorPage).toHaveBeenCalled();

    const firstCall = vi.mocked(CustomErrorPage).mock.calls[0];
    const props = firstCall[0];

    expect(props).toHaveProperty('children');
    expect(props.children).toBeDefined();
  });
});
