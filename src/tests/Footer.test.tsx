import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

import Footer from '../components/layout/Footer/Footer';

describe('Footer', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('renders copyright text', () => {
    expect(screen.getByText('© 2025 PUTMAN')).toBeInTheDocument();
  });

  it('renders all author names', () => {
    expect(screen.getByText('Dmitry Starchenko')).toBeInTheDocument();
    expect(screen.getByText('Husan Abdigafurov')).toBeInTheDocument();
    expect(screen.getByText('Bubnov Roma')).toBeInTheDocument();
  });

  it('has links for each author', () => {
    const dmitryLink = screen.getByText('Dmitry Starchenko').closest('a');
    const husanLink = screen.getByText('Husan Abdigafurov').closest('a');
    const romaLink = screen.getByText('Bubnov Roma').closest('a');

    expect(dmitryLink).toHaveAttribute('href', 'https://github.com/DmitryStarchenko');
    expect(husanLink).toHaveAttribute('href', 'https://github.com/husanGuru');
    expect(romaLink).toHaveAttribute('href', 'https://github.com/Bubnov-Roma');
  });
});
