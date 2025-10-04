import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import Response from '@/components/client/BottomSection/Response';
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

describe('Response Component', () => {
  const successResponse: ApiResponse = {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: {
      'content-type': 'application/json',
    },
    data: { message: 'success', items: [1, 2, 3] },
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

  const defaultProps = {
    response: null,
    errorMessage: null,
    unknownErrorText: 'Unknown error occurred',
    internalErrorText: 'Internal server error',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders no response message when response is null and no error', () => {
    render(<Response {...defaultProps} />);

    const codeEditor = screen.getByTestId('code-editor');
    expect(codeEditor).toHaveValue('No response yet');
  });

  test('renders error message when errorMessage is provided (even without response)', () => {
    const errorMessage = 'Network error occurred';
    const props = {
      ...defaultProps,
      errorMessage,
    };

    render(<Response {...props} />);

    const codeEditor = screen.getByTestId('code-editor');
    expect(codeEditor).toHaveValue(errorMessage);
  });

  test('renders error message instead of response when both are provided', () => {
    const errorMessage = 'Network error occurred';
    const props = {
      ...defaultProps,
      response: successResponse,
      errorMessage,
    };

    render(<Response {...props} />);

    const codeEditor = screen.getByTestId('code-editor');
    expect(codeEditor).toHaveValue(errorMessage);
  });

  test('renders string data from success response as-is', () => {
    const responseWithStringData: ApiResponse = {
      ...successResponse,
      data: 'plain text response',
    };

    const props = {
      ...defaultProps,
      response: responseWithStringData,
    };

    render(<Response {...props} />);

    const codeEditor = screen.getByTestId('code-editor');
    expect(codeEditor).toHaveValue('plain text response');
  });

  test('renders object data from success response as formatted JSON', () => {
    const props = {
      ...defaultProps,
      response: successResponse,
    };

    render(<Response {...props} />);

    const codeEditor = screen.getByTestId('code-editor');
    const expectedJson = JSON.stringify(successResponse.data, null, 2);
    expect(codeEditor).toHaveValue(expectedJson);
  });

  test('renders error from error response', () => {
    const props = {
      ...defaultProps,
      response: errorResponse,
    };

    render(<Response {...props} />);

    const codeEditor = screen.getByTestId('code-editor');
    expect(codeEditor).toHaveValue(errorResponse.error);
  });

  test('renders unknown error text when error response has no error message', () => {
    const responseWithoutError: ApiResponse = {
      ...errorResponse,
      error: undefined as unknown as string,
    };

    const unknownErrorText = 'Custom unknown error';
    const props = {
      ...defaultProps,
      response: responseWithoutError,
      unknownErrorText,
    };

    render(<Response {...props} />);

    const codeEditor = screen.getByTestId('code-editor');
    expect(codeEditor).toHaveValue(unknownErrorText);
  });

  test('code editor is always read-only', () => {
    const props = {
      ...defaultProps,
      response: successResponse,
    };

    render(<Response {...props} />);

    const codeEditor = screen.getByTestId('code-editor');
    expect(codeEditor).toHaveAttribute('data-readonly', 'true');
    expect(codeEditor).toHaveAttribute('readonly');
  });

  test('uses json language for code editor', () => {
    const props = {
      ...defaultProps,
      response: successResponse,
    };

    render(<Response {...props} />);

    const codeEditor = screen.getByTestId('code-editor');
    expect(codeEditor).toHaveAttribute('data-language', 'json');
  });

  test('has fixed height of 340px', () => {
    const props = {
      ...defaultProps,
      response: successResponse,
    };

    render(<Response {...props} />);

    const codeEditor = screen.getByTestId('code-editor');
    expect(codeEditor).toHaveAttribute('data-height', '340px');
  });

  test('handles null data in success response', () => {
    const responseWithNullData: ApiResponse = {
      ...successResponse,
      data: null,
    };

    const props = {
      ...defaultProps,
      response: responseWithNullData,
    };

    render(<Response {...props} />);

    const codeEditor = screen.getByTestId('code-editor');
    expect(codeEditor).toHaveValue('null');
  });

  test('handles array data in success response', () => {
    const responseWithArrayData: ApiResponse = {
      ...successResponse,
      data: ['item1', 'item2', 'item3'],
    };

    const props = {
      ...defaultProps,
      response: responseWithArrayData,
    };

    render(<Response {...props} />);

    const codeEditor = screen.getByTestId('code-editor');
    const expectedJson = JSON.stringify(responseWithArrayData.data, null, 2);
    expect(codeEditor).toHaveValue(expectedJson);
  });
});
