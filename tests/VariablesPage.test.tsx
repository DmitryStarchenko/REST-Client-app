import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/dynamic', () => ({
  default: vi
    .fn()
    .mockReturnValue(vi.fn().mockImplementation(() => <div>Mocked Variables Component</div>)),
}));

vi.mock('@/components/variables/Variables', () => ({
  default: vi.fn().mockImplementation(() => <div>Variables Component Content</div>),
}));

import VariablesPage from '../src/app/[locale]/(protected)/variables/page';

describe('VariablesPage', () => {
  it('should render without errors', () => {
    expect(() => render(<VariablesPage />)).not.toThrow();
  });

  it('should render the Variables component', () => {
    render(<VariablesPage />);
    expect(screen.getByText('Mocked Variables Component')).toBeInTheDocument();
  });
});
