import { render } from '@testing-library/react';
import { redirect } from 'next/navigation';
import React from 'react';
import { describe, it, vi, expect, beforeEach } from 'vitest';

import RootPage from '../src/app/page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('RootPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call redirect with "/en" path', () => {
    render(<RootPage />);

    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith('/en');
  });

  it('should return null (or nothing) since redirect throws', () => {
    const { container } = render(<RootPage />);
    expect(container.firstChild).toBeNull();
  });

  it('should be a readonly functional component', () => {
    expect(typeof RootPage).toBe('function');
    const props: Parameters<typeof RootPage>[0] = {};
    expect(props).toEqual({});
  });
});
