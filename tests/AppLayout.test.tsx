import { render } from '@testing-library/react';
import { type ReactNode } from 'react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import RootLayout from '../src/app/layout';

describe('AppLayout', () => {
  it('should render children correctly', () => {
    const testText = 'Test Child Content';
    const TestChild = (): ReactNode => <div>{testText}</div>;

    const { getByText } = render(
      <RootLayout>
        <TestChild />
      </RootLayout>,
    );

    expect(getByText(testText)).toBeInTheDocument();
  });

  it('should render multiple children correctly', () => {
    const { getByText } = render(
      <RootLayout>
        <div>First Child</div>
        <div>Second Child</div>
      </RootLayout>,
    );

    expect(getByText('First Child')).toBeInTheDocument();
    expect(getByText('Second Child')).toBeInTheDocument();
  });

  it('should render empty children without errors', () => {
    const { container } = render(<RootLayout>{null}</RootLayout>);

    expect(container.firstChild).toBeNull();
  });

  it('should render string children correctly', () => {
    const testString = 'Simple string child';
    const { getByText } = render(<RootLayout>{testString}</RootLayout>);

    expect(getByText(testString)).toBeInTheDocument();
  });

  it('should render number children correctly', () => {
    const testNumber = 42;
    const { getByText } = render(<RootLayout>{testNumber}</RootLayout>);

    expect(getByText(testNumber.toString())).toBeInTheDocument();
  });
});
