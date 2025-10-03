import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import BottomTabsBlock from '@/components/client/ResponseSection';
import { ApiResponse } from '@/types';

vi.mock('@/components/client/BottomSection/Response', () => ({
  default: vi.fn(({ errorMessage, unknownErrorText, internalErrorText }) => (
    <div data-testid="response-block">
      <div data-testid="response-content">Response Content</div>
      <div data-testid="error-message">{errorMessage}</div>
      <div data-testid="unknown-error">{unknownErrorText}</div>
      <div data-testid="internal-error">{internalErrorText}</div>
    </div>
  )),
}));

vi.mock('@/components/client/BottomSection/Headers', () => ({
  default: vi.fn(({ errorMessage }) => (
    <div data-testid="headers-block">
      <div data-testid="headers-content">Headers Content</div>
      <div data-testid="error-message">{errorMessage}</div>
    </div>
  )),
}));

vi.mock('@/components/client/BottomSection/Statistic', () => ({
  default: vi.fn(({ errorMessage }) => (
    <div data-testid="statistic-block">
      <div data-testid="statistic-content">Statistic Content</div>
      <div data-testid="error-message">{errorMessage}</div>
    </div>
  )),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'BottomTabsBlock.Response': 'Response',
      'BottomTabsBlock.Response Headers': 'Response Headers',
      'BottomTabsBlock.Statistic Fields': 'Statistic Fields',
    };
    return translations[key] || key;
  },
}));

vi.mock('@mui/icons-material', () => ({
  ExpandLess: () => <span data-testid="expand-less-icon">ExpandLess</span>,
  ExpandMore: () => <span data-testid="expand-more-icon">ExpandMore</span>,
}));

describe('BottomTabsBlock Component', () => {
  const successResponse: ApiResponse = {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: {
      'content-type': 'application/json',
    },
    data: { message: 'success' },
    durationMs: 150,
    responseSize: 1024,
    timestamp: '2023-12-01T10:00:00Z',
  };

  const defaultProps = {
    response: null,
    errorMessage: null,
    unknownErrorText: 'Unknown error occurred',
    internalErrorText: 'Internal server error',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders all tabs and collapse/expand button', () => {
    render(<BottomTabsBlock {...defaultProps} />);

    expect(screen.getByText('Response')).toBeInTheDocument();
    expect(screen.getByText('Response Headers')).toBeInTheDocument();
    expect(screen.getByText('Statistic Fields')).toBeInTheDocument();
    expect(screen.getByTestId('expand-less-icon')).toBeInTheDocument();
  });

  test('shows Response tab by default', () => {
    render(<BottomTabsBlock {...defaultProps} />);

    expect(screen.getByTestId('response-block')).toBeInTheDocument();
    expect(screen.queryByTestId('headers-block')).not.toBeInTheDocument();
    expect(screen.queryByTestId('statistic-block')).not.toBeInTheDocument();
  });

  test('switches to Headers tab when clicked', () => {
    render(<BottomTabsBlock {...defaultProps} />);

    const headersTab = screen.getByText('Response Headers');
    fireEvent.click(headersTab);

    expect(screen.getByTestId('headers-block')).toBeInTheDocument();
    expect(screen.queryByTestId('response-block')).not.toBeInTheDocument();
    expect(screen.queryByTestId('statistic-block')).not.toBeInTheDocument();
  });

  test('switches to Statistic tab when clicked', () => {
    render(<BottomTabsBlock {...defaultProps} />);

    const statisticTab = screen.getByText('Statistic Fields');
    fireEvent.click(statisticTab);

    expect(screen.getByTestId('statistic-block')).toBeInTheDocument();
    expect(screen.queryByTestId('response-block')).not.toBeInTheDocument();
    expect(screen.queryByTestId('headers-block')).not.toBeInTheDocument();
  });

  test('can switch back to Response tab from other tabs', () => {
    render(<BottomTabsBlock {...defaultProps} />);

    const headersTab = screen.getByText('Response Headers');
    fireEvent.click(headersTab);
    expect(screen.getByTestId('headers-block')).toBeInTheDocument();

    const responseTab = screen.getByText('Response');
    fireEvent.click(responseTab);
    expect(screen.getByTestId('response-block')).toBeInTheDocument();
    expect(screen.queryByTestId('headers-block')).not.toBeInTheDocument();
  });

  test('collapses and expands content when button is clicked', () => {
    render(<BottomTabsBlock {...defaultProps} />);

    expect(screen.getByTestId('response-block')).toBeInTheDocument();

    expect(screen.getByTestId('expand-less-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('expand-more-icon')).not.toBeInTheDocument();

    const collapseButton = screen.getByRole('button');
    fireEvent.click(collapseButton);

    expect(screen.queryByTestId('response-block')).not.toBeInTheDocument();
    expect(screen.getByTestId('expand-more-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('expand-less-icon')).not.toBeInTheDocument();

    fireEvent.click(collapseButton);

    expect(screen.getByTestId('response-block')).toBeInTheDocument();
    expect(screen.getByTestId('expand-less-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('expand-more-icon')).not.toBeInTheDocument();
  });

  test('passes correct props to Response component', () => {
    const props = {
      response: successResponse,
      errorMessage: 'Custom error',
      unknownErrorText: 'Custom unknown error',
      internalErrorText: 'Custom internal error',
    };

    render(<BottomTabsBlock {...props} />);

    expect(screen.getByTestId('response-block')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveTextContent('Custom error');
  });

  test('passes correct props to Headers component', () => {
    const props = {
      response: successResponse,
      errorMessage: 'Custom error',
      unknownErrorText: 'Custom unknown error',
      internalErrorText: 'Custom internal error',
    };

    render(<BottomTabsBlock {...props} />);

    const headersTab = screen.getByText('Response Headers');
    fireEvent.click(headersTab);

    expect(screen.getByTestId('headers-block')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveTextContent('Custom error');
  });

  test('passes correct props to Statistic component', () => {
    const props = {
      response: successResponse,
      errorMessage: 'Custom error',
      unknownErrorText: 'Custom unknown error',
      internalErrorText: 'Custom internal error',
    };

    render(<BottomTabsBlock {...props} />);

    const statisticTab = screen.getByText('Statistic Fields');
    fireEvent.click(statisticTab);

    expect(screen.getByTestId('statistic-block')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveTextContent('Custom error');
  });

  test('maintains tab state when collapsing and expanding', () => {
    render(<BottomTabsBlock {...defaultProps} />);

    const headersTab = screen.getByText('Response Headers');
    fireEvent.click(headersTab);
    expect(screen.getByTestId('headers-block')).toBeInTheDocument();

    const collapseButton = screen.getByRole('button');
    fireEvent.click(collapseButton);
    expect(screen.queryByTestId('headers-block')).not.toBeInTheDocument();

    fireEvent.click(collapseButton);
    expect(screen.getByTestId('headers-block')).toBeInTheDocument();
  });

  test('handles null response correctly', () => {
    render(<BottomTabsBlock {...defaultProps} />);

    expect(screen.getByTestId('response-block')).toBeInTheDocument();
  });

  test('handles error response correctly', () => {
    const errorResponse: ApiResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found',
      error: 'Resource not found',
      durationMs: 100,
      responseSize: 512,
      timestamp: '2023-12-01T10:00:00Z',
    };

    const props = {
      ...defaultProps,
      response: errorResponse,
    };

    render(<BottomTabsBlock {...props} />);

    expect(screen.getByTestId('response-block')).toBeInTheDocument();
  });

  test('applies correct styles to active tab', () => {
    render(<BottomTabsBlock {...defaultProps} />);

    const responseTab = screen.getByText('Response');
    expect(responseTab).toHaveAttribute('aria-selected', 'true');

    const headersTab = screen.getByText('Response Headers');
    expect(headersTab).toHaveAttribute('aria-selected', 'false');
  });
});
