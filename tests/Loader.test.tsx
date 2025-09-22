import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import Loader from '../src/components/shared/Loader/Loader';
import styles from '../src/components/shared/Loader/Loader.module.css';

describe('Loader', () => {
  it('should render loader component', () => {
    render(<Loader />);

    const loaderElement = screen.getByTestId('loader');
    expect(loaderElement).toBeInTheDocument();
  });

  it('should have correct CSS class', () => {
    render(<Loader />);

    const loaderElement = screen.getByTestId('loader');
    expect(loaderElement).toHaveClass(styles.loader);
  });

  it('should be a div element', () => {
    render(<Loader />);

    const loaderElement = screen.getByTestId('loader');
    expect(loaderElement.tagName).toBe('DIV');
  });
});
