import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import CustomErrorPage from '../src/components/shared/ErrorPage/ErrorPage';

interface CustomErrorPageProps {
  title: string;
  message: string;
  children?: React.ReactNode;
}

describe('CustomErrorPage', () => {
  const defaultProps: CustomErrorPageProps = {
    title: 'Test Error',
    message: 'This is a test error message',
  };

  it('should render title and message correctly', () => {
    render(<CustomErrorPage {...defaultProps} />);
    expect(screen.getByText('Test Error')).toBeInTheDocument();
    expect(screen.getByText('This is a test error message')).toBeInTheDocument();
  });

  it('should render children when provided', () => {
    const testId = 'test-child';
    const children = <div data-testid={testId}>Child content</div>;
    render(<CustomErrorPage {...defaultProps}>{children}</CustomErrorPage>);
    expect(screen.getByTestId(testId)).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('should not render children when not provided', () => {
    render(<CustomErrorPage {...defaultProps} />);
    const allTextContent = screen
      .getAllByText(/./)
      .map((element) => element.textContent)
      .filter((text) => text !== defaultProps.title && text !== defaultProps.message);

    expect(allTextContent).toHaveLength(0);
  });

  it('should have correct structure with required props only', () => {
    const { container } = render(<CustomErrorPage {...defaultProps} />);
    const heading = container.querySelector('h1');
    const paragraph = container.querySelector('p');

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(defaultProps.title);
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent(defaultProps.message);
  });

  it('should apply correct CSS class from module', () => {
    const { container } = render(<CustomErrorPage {...defaultProps} />);
    const errorPageElement = container.firstChild as HTMLElement;
    expect(errorPageElement.className).toContain('errorPage');
  });
});
