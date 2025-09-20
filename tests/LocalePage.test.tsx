import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Main from '@/components/layout/Main/Main';

import MainPage from '../src/app/[locale]/page';

vi.mock('@/components/layout/Main/Main', () => ({
  default: vi.fn(() => <div data-testid="main-component" />),
}));

describe('MainPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<MainPage />);
    expect(screen.getByTestId('main-component')).toBeInTheDocument();
  });

  it('should render Main component at least once', () => {
    render(<MainPage />);
    expect(Main).toHaveBeenCalled();
  });

  it('should match snapshot', () => {
    const { container } = render(<MainPage />);
    expect(container).toMatchSnapshot();
  });
});
