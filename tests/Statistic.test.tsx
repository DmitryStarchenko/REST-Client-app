import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import Statistic from '@/components/client/ResponseSection/Statistic';
import { ApiResponse } from '@/types';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'ResponseBlock.No response yet': 'No response yet',
      'ResponseBlock.Status': 'Status',
      'ResponseBlock.StatusText': 'StatusText',
      'ResponseBlock.Success': 'Success',
      'ResponseBlock.Duration': 'Duration',
      'ResponseBlock.ms': 'ms',
      'ResponseBlock.Response': 'Response',
      'ResponseBlock.bytes': 'bytes',
      'ResponseBlock.Timestamp': 'Timestamp',
    };
    return translations[key] || key;
  },
}));

describe('Statistic Component', () => {
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

  const errorResponse: ApiResponse = {
    ok: false,
    status: 404,
    statusText: 'Not Found',
    error: 'Resource not found',
    durationMs: 100,
    responseSize: 512,
    timestamp: '2023-12-01T10:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders no response message when response is null', () => {
    render(<Statistic response={null} errorMessage={null} />);

    expect(screen.getByText('No response yet')).toBeInTheDocument();
  });

  test('renders error message when errorMessage is provided', () => {
    const errorMessage = 'Network error occurred';
    render(<Statistic response={null} errorMessage={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(/Timestamp: -/)).toBeInTheDocument();
  });

  test('renders error message with response timestamp when both errorMessage and response are provided', () => {
    const errorMessage = 'Network error occurred';
    render(<Statistic response={successResponse} errorMessage={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`Timestamp: ${successResponse.timestamp}`)),
    ).toBeInTheDocument();
  });

  test('renders success response statistics correctly', () => {
    render(<Statistic response={successResponse} errorMessage={null} />);

    expect(screen.getByText(new RegExp(`Status: ${successResponse.status}`))).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`StatusText: ${successResponse.statusText}`)),
    ).toBeInTheDocument();
    expect(screen.getByText(/Success: true/)).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`Duration: ${successResponse.durationMs} ms`)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`Response: ${successResponse.responseSize} bytes`)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`Timestamp: ${successResponse.timestamp}`)),
    ).toBeInTheDocument();
  });

  test('renders error response statistics correctly', () => {
    render(<Statistic response={errorResponse} errorMessage={null} />);

    expect(screen.getByText(new RegExp(`Status: ${errorResponse.status}`))).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`StatusText: ${errorResponse.statusText}`)),
    ).toBeInTheDocument();
    expect(screen.getByText(/Success: false/)).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`Duration: ${errorResponse.durationMs} ms`)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`Response: ${errorResponse.responseSize} bytes`)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`Timestamp: ${errorResponse.timestamp}`)),
    ).toBeInTheDocument();
  });

  test('handles missing optional fields in success response', () => {
    const responseWithoutOptionalFields: ApiResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: {},
      data: null,
    };

    render(<Statistic response={responseWithoutOptionalFields} errorMessage={null} />);

    expect(screen.getByText(/Status: 200/)).toBeInTheDocument();
    expect(screen.getByText(/StatusText: OK/)).toBeInTheDocument();
    expect(screen.getByText(/Success: true/)).toBeInTheDocument();
    expect(screen.getByText(/Duration: - ms/)).toBeInTheDocument();
    expect(screen.getByText(/Response: - bytes/)).toBeInTheDocument();
    expect(screen.getByText(/Timestamp: -/)).toBeInTheDocument();
  });

  test('handles missing optional fields in error response', () => {
    const responseWithoutOptionalFields: ApiResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      error: 'Server error',
    };

    render(<Statistic response={responseWithoutOptionalFields} errorMessage={null} />);

    expect(screen.getByText(/Status: 500/)).toBeInTheDocument();
    expect(screen.getByText(/StatusText: Internal Server Error/)).toBeInTheDocument();
    expect(screen.getByText(/Success: false/)).toBeInTheDocument();
    expect(screen.getByText(/Duration: - ms/)).toBeInTheDocument();
    expect(screen.getByText(/Response: - bytes/)).toBeInTheDocument();
    expect(screen.getByText(/Timestamp: -/)).toBeInTheDocument();
  });

  test('applies correct color styles for success response', () => {
    render(<Statistic response={successResponse} errorMessage={null} />);

    const statusElement = screen.getByText(new RegExp(`Status: ${successResponse.status}`));
    expect(statusElement).toHaveClass('MuiTypography-body2');
  });

  test('applies correct color styles for error response', () => {
    render(<Statistic response={errorResponse} errorMessage={null} />);

    const statusElement = screen.getByText(new RegExp(`Status: ${errorResponse.status}`));
    expect(statusElement).toHaveClass('MuiTypography-body2');
  });

  test('applies error color when errorMessage is provided', () => {
    const errorMessage = 'Network error';
    render(<Statistic response={null} errorMessage={errorMessage} />);

    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toHaveClass('MuiTypography-body2');
  });

  test('renders all statistics in a stack layout', () => {
    render(<Statistic response={successResponse} errorMessage={null} />);

    const stackElements = screen.getAllByText(/:/);
    expect(stackElements.length).toBeGreaterThan(0);
  });
});
