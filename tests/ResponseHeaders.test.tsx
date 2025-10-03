import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import ResponseHeaders from '@/components/client/ResponseSection/Headers';
import { ApiResponse } from '@/types';

vi.mock('@/components/client/Shared', () => ({
  CodeEditor: vi.fn(({ value, height, language, readOnly }) => (
    <textarea
      data-testid="code-editor"
      data-value={value}
      data-height={height}
      data-language={language}
      data-readonly={readOnly?.toString()}
      value={value}
      readOnly={readOnly}
    />
  )),
}));

vi.mock('@/components/client/BottomSection/Response', () => ({
  default: vi.fn(({ response, errorMessage, unknownErrorText, internalErrorText }) => (
    <div data-testid="response-block">
      <div data-testid="response-data">{JSON.stringify(response)}</div>
      <div data-testid="error-message">{errorMessage}</div>
      <div data-testid="unknown-error">{unknownErrorText}</div>
      <div data-testid="internal-error">{internalErrorText}</div>
    </div>
  )),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'ResponseBlock.No response yet': 'No response yet',
    };
    return translations[key] || key;
  },
}));

vi.mock('jotai', async (importOriginal) => {
  const actual = await importOriginal<typeof import('jotai')>();
  return {
    ...actual,
    useAtomValue: () => 'light',
  };
});

describe('ResponseHeaders Component', () => {
  const successResponse: ApiResponse = {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: {
      'content-type': 'application/json',
      'x-custom-header': 'test-value',
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
    headers: {
      'content-type': 'application/json',
    },
    error: 'Resource not found',
    durationMs: 100,
    responseSize: 512,
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

  test('renders headers editor when response has headers', () => {
    const props = {
      ...defaultProps,
      response: successResponse,
    };

    render(<ResponseHeaders {...props} />);

    const codeEditor = screen.getByTestId('code-editor');
    expect(codeEditor).toBeInTheDocument();
    expect(codeEditor).toHaveAttribute('data-language', 'json');
    expect(codeEditor).toHaveAttribute('data-readonly', 'true');

    const expectedHeaders = JSON.stringify(successResponse.headers, null, 2);
    expect(codeEditor).toHaveValue(expectedHeaders);
  });

  test('renders ResponseBlock when response has no headers property', () => {
    const responseWithoutHeaders = {
      ok: true,
      status: 200,
      statusText: 'OK',
      data: { message: 'success' },
      durationMs: 150,
      responseSize: 1024,
      timestamp: '2023-12-01T10:00:00Z',
    } as ApiResponse;

    const props = {
      ...defaultProps,
      response: responseWithoutHeaders,
    };

    render(<ResponseHeaders {...props} />);

    const responseBlock = screen.getByTestId('response-block');
    expect(responseBlock).toBeInTheDocument();
  });

  test('renders ResponseBlock when response is null', () => {
    render(<ResponseHeaders {...defaultProps} />);

    const responseBlock = screen.getByTestId('response-block');
    expect(responseBlock).toBeInTheDocument();
  });

  test('renders headers editor when headers are empty object', () => {
    const responseWithEmptyHeaders: ApiResponse = {
      ...successResponse,
      headers: {},
    };

    const props = {
      ...defaultProps,
      response: responseWithEmptyHeaders,
    };

    render(<ResponseHeaders {...props} />);

    const codeEditor = screen.getByTestId('code-editor');
    expect(codeEditor).toBeInTheDocument();
    expect(codeEditor).toHaveValue('{}');
  });

  test('renders headers editor when error response has headers', () => {
    const props = {
      ...defaultProps,
      response: errorResponse,
    };

    render(<ResponseHeaders {...props} />);

    const codeEditor = screen.getByTestId('code-editor');
    expect(codeEditor).toBeInTheDocument();

    const expectedHeaders = JSON.stringify(errorResponse.headers, null, 2);
    expect(codeEditor).toHaveValue(expectedHeaders);
  });

  test('passes correct props to ResponseBlock when no headers', () => {
    const responseWithoutHeaders = {
      ok: true,
      status: 200,
      statusText: 'OK',
      data: { message: 'success' },
      durationMs: 150,
      responseSize: 1024,
      timestamp: '2023-12-01T10:00:00Z',
    } as ApiResponse;

    const props = {
      response: responseWithoutHeaders,
      errorMessage: 'Custom error message',
      unknownErrorText: 'Custom unknown error',
      internalErrorText: 'Custom internal error',
    };

    render(<ResponseHeaders {...props} />);

    const responseBlock = screen.getByTestId('response-block');
    expect(responseBlock).toBeInTheDocument();

    expect(screen.getByTestId('response-data')).toHaveTextContent(
      JSON.stringify(responseWithoutHeaders),
    );
    expect(screen.getByTestId('error-message')).toHaveTextContent('Custom error message');
    expect(screen.getByTestId('unknown-error')).toHaveTextContent('Custom unknown error');
    expect(screen.getByTestId('internal-error')).toHaveTextContent('Custom internal error');
  });

  test('formats headers with proper indentation', () => {
    const props = {
      ...defaultProps,
      response: successResponse,
    };

    render(<ResponseHeaders {...props} />);

    const codeEditor = screen.getByTestId('code-editor');
    const expectedOutput = `{
  "content-type": "application/json",
  "x-custom-header": "test-value"
}`;
    expect(codeEditor).toHaveValue(expectedOutput);
  });

  test('code editor is read-only when showing headers', () => {
    const props = {
      ...defaultProps,
      response: successResponse,
    };

    render(<ResponseHeaders {...props} />);

    const codeEditor = screen.getByTestId('code-editor');
    expect(codeEditor).toHaveAttribute('data-readonly', 'true');
    expect(codeEditor).toHaveAttribute('readonly');
  });

  test('uses json language for headers editor', () => {
    const props = {
      ...defaultProps,
      response: successResponse,
    };

    render(<ResponseHeaders {...props} />);

    const codeEditor = screen.getByTestId('code-editor');
    expect(codeEditor).toHaveAttribute('data-language', 'json');
  });

  test('has fixed height of 340px for headers editor', () => {
    const props = {
      ...defaultProps,
      response: successResponse,
    };

    render(<ResponseHeaders {...props} />);

    const codeEditor = screen.getByTestId('code-editor');
    expect(codeEditor).toHaveAttribute('data-height', '340px');
  });

  test('handles headers with multiple values', () => {
    const responseWithComplexHeaders: ApiResponse = {
      ...successResponse,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-cache, no-store',
        'set-cookie': ['session=abc123', 'token=xyz456'],
      },
    };

    const props = {
      ...defaultProps,
      response: responseWithComplexHeaders,
    };

    render(<ResponseHeaders {...props} />);

    const codeEditor = screen.getByTestId('code-editor');
    expect(codeEditor).toBeInTheDocument();

    const value = codeEditor.getAttribute('data-value') || '';
    expect(value).toContain('content-type');
    expect(value).toContain('cache-control');
    expect(value).toContain('set-cookie');
  });

  test('prioritizes errorMessage over headers when both are provided', () => {
    const errorMessage = 'Network error occurred';
    const responseWithoutHeaders = {
      ok: true,
      status: 200,
      statusText: 'OK',
      data: { message: 'success' },
      durationMs: 150,
      responseSize: 1024,
      timestamp: '2023-12-01T10:00:00Z',
    } as ApiResponse;

    const props = {
      ...defaultProps,
      response: responseWithoutHeaders,
      errorMessage,
    };

    render(<ResponseHeaders {...props} />);

    const responseBlock = screen.getByTestId('response-block');
    expect(responseBlock).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
  });
});
