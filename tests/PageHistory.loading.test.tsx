import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/dynamic', () => ({
  default: vi.fn((importFn, options) => {
    return options.loading;
  }),
}));

vi.mock('../src/components/shared/Loader/Loader.tsx', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('../src/components/layout/History/History.module.css', () => ({
  __esModule: true,
  default: {
    main: 'mock-main-class',
  },
}));

import LayoutHistory from '../src/app/[locale]/(protected)/history/page';

describe('LayoutHistory Loading State', () => {
  it('should render loader inside main element with correct class when loading', () => {
    render(<LayoutHistory />);

    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveTextContent('Loading...');

    const mainElement = loader.closest('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('mock-main-class');
  });

  it('should have correct structure for loading state', () => {
    const { container } = render(<LayoutHistory />);
    const mainElement = container.querySelector('main.mock-main-class');
    expect(mainElement).toBeInTheDocument();

    const loaderElement = mainElement?.querySelector('[data-testid="loader"]');
    expect(loaderElement).toBeInTheDocument();
    expect(loaderElement).toHaveTextContent('Loading...');
  });
});
