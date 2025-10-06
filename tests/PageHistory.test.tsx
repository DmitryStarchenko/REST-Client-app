import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/dynamic', () => ({
  default: vi.fn((importFn, options) => {
    expect(options.ssr).toBe(true);
    expect(typeof options.loading).toBe('function');

    const MockComponent = (): React.JSX.Element => <div data-testid="history-content">History</div>;
    return MockComponent;
  }),
}));

vi.mock('../Loader/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('./History.module.css', () => ({
  main: 'mock-main-class',
}));

import LayoutHistory from '../src/app/[locale]/(protected)/history/page';

describe('LayoutHistory', () => {
  it('should render without errors', () => {
    const { container } = render(<LayoutHistory />);
    expect(container).toBeDefined();
  });

  it('should render the actual component', () => {
    render(<LayoutHistory />);

    expect(screen.getByTestId('history-content')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('should not show loader when component is loaded', () => {
    render(<LayoutHistory />);

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });
});
