import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import ClientIndex from '../src/app/[locale]/(protected)/client/page';

vi.mock('next/dynamic', () => ({
  default: vi.fn(() => {
    const MockComponent = (): React.JSX.Element => (
      <div data-testid="rest-client-wrapper">RestClientWrapper</div>
    );
    MockComponent.displayName = 'MockRestClientWrapper';
    return MockComponent;
  }),
}));

vi.mock('@/components/shared/Loader/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

describe('ClientIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render without errors', () => {
    expect(() => render(<ClientIndex />)).not.toThrow();
  });

  it('should render the RestClientWrapper component', () => {
    render(<ClientIndex />);

    const restClientWrapper = screen.getByTestId('rest-client-wrapper');
    expect(restClientWrapper).toBeInTheDocument();
    expect(restClientWrapper).toHaveTextContent('RestClientWrapper');
  });

  it('should have proper display name', () => {
    expect(ClientIndex.displayName).toBeUndefined();
  });
});
