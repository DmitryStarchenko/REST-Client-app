import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/components/shared/ErrorPage/ErrorPage', () => ({
  default: vi.fn(({ title, message }: { title: string; message: string }) => (
    <div data-testid="error-page">
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  )),
}));

import GlobalNotFound from '../src/app/not-found';

describe('GlobalNotFound', () => {
  it('should render html and body elements', () => {
    render(<GlobalNotFound />);
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    expect(htmlElement).toBeInTheDocument();
    expect(bodyElement).toBeInTheDocument();
    expect(htmlElement).toHaveAttribute('lang', 'en');
  });

  it('should render ErrorPage component with correct props', () => {
    render(<GlobalNotFound />);
    const errorPage = screen.getByTestId('error-page');
    expect(errorPage).toBeInTheDocument();
    const titleElement = screen.getByRole('heading', { level: 1 });
    const messageElement = screen.getByText('Could not find resource');
    expect(titleElement).toHaveTextContent('Not Found!');
    expect(messageElement).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<GlobalNotFound />);
    expect(container).toMatchSnapshot();
  });
});
