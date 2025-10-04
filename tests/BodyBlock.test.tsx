import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import BodyBlock from '@/components/client/RequestSection/Body';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'BodyBlock.Copy base64': 'Copy base64',
      'BodyBlock.Invalid JSON': 'Invalid JSON',
    };
    return translations[key] || key;
  },
}));

vi.mock('@/utils', () => ({
  encodeBase64: (input: string) => btoa(input),
}));

vi.mock('@/components/client/Shared/', () => ({
  CodeEditor: ({
    value,
    onChange,
    language,
  }: {
    value: string;
    onChange?: (value: string) => void;
    language: string;
  }) => (
    <textarea
      data-testid="code-editor"
      data-language={language}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  ),
}));
const mockWriteText = vi.fn();
Object.defineProperty(global.navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  writable: true,
});

describe('BodyBlock Component', () => {
  const mockSetBodyText = vi.fn();
  const defaultProps = {
    bodyText: '{"test": "data"}',
    setBodyText: mockSetBodyText,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders basic elements', () => {
    render(<BodyBlock {...defaultProps} />);

    expect(screen.getByTestId('copy-base-button')).toBeInTheDocument();
    expect(screen.getByTestId('select-body-type')).toBeInTheDocument();
    expect(screen.getByTestId('code-editor')).toBeInTheDocument();
    expect(screen.getByText('Copy base64')).toBeInTheDocument();
  });

  test('shows JSON error for invalid JSON when type is JSON', async () => {
    const invalidJsonProps = {
      bodyText: '{invalid: json}',
      setBodyText: mockSetBodyText,
    };

    render(<BodyBlock {...invalidJsonProps} />);

    await waitFor(() => {
      expect(screen.getByText(/Invalid JSON/)).toBeInTheDocument();
    });

    const copyButton = screen.getByTestId('copy-base-button');
    expect(copyButton).toBeDisabled();
  });

  test('updates editor value when bodyText changes', () => {
    const { rerender } = render(<BodyBlock {...defaultProps} />);

    const editor = screen.getByTestId('code-editor');
    expect(editor).toHaveValue('{"test": "data"}');

    rerender(<BodyBlock bodyText="new content" setBodyText={mockSetBodyText} />);

    expect(editor).toHaveValue('new content');
  });
});
