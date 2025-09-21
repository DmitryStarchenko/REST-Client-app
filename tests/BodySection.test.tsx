import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@monaco-editor/react', () => ({
  default: vi.fn(({ value, onChange, theme, options }) => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      data-theme={theme}
      style={{
        height: options?.height,
        fontFamily: options?.fontFamily,
        fontSize: options?.fontSize,
      }}
    />
  )),
}));

vi.mock('@/utils/base64', () => ({
  encodeBase64: vi.fn((text: string) => `encoded-${text}`),
}));

const mockWriteText = vi.fn().mockResolvedValue(undefined);
vi.stubGlobal('navigator', {
  clipboard: {
    writeText: mockWriteText,
  },
});

import { encodeBase64 } from '@/utils/base64';

import BodyBlock from '../src/components/client/BodySection/index';

describe('BodyBlock', () => {
  const mockSetBodyText = vi.fn();
  const defaultProps = {
    bodyText: '{"test": "data"}',
    setBodyText: mockSetBodyText,
    theme: 'vs-dark',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockWriteText.mockClear();
    mockWriteText.mockResolvedValue(undefined);
    vi.mocked(encodeBase64).mockClear();
    vi.mocked(encodeBase64).mockImplementation((text: string) => `encoded-${text}`);
  });

  it('renders the component with the correct props', () => {
    render(<BodyBlock {...defaultProps} />);
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByTestId('monaco-editor')).toHaveValue('{"test": "data"}');
    expect(screen.getByTestId('monaco-editor')).toHaveAttribute('data-theme', 'vs-dark');
  });

  it('copies base64-encoded text to the clipboard', async () => {
    const user = userEvent.setup();
    render(<BodyBlock {...defaultProps} />);
    const copyButton = screen.getByRole('button', { name: /copy base64\(body\)/i });
    await user.click(copyButton);
    await waitFor(() => {
      expect(vi.mocked(encodeBase64)).toHaveBeenCalledWith('{"test": "data"}');
    });
  });

  it('checks the copy implementation', async () => {
    const user = userEvent.setup();
    render(<BodyBlock {...defaultProps} bodyText="test" />);
    const copyButton = screen.getByRole('button', { name: /copy base64\(body\)/i });
    expect(copyButton).toHaveAttribute('type', 'button');
    await user.click(copyButton);
    await waitFor(() => {
      expect(vi.mocked(encodeBase64)).toHaveBeenCalled();
    });
  });

  it('handles empty text when copying', async () => {
    const user = userEvent.setup();
    render(<BodyBlock {...defaultProps} bodyText="" />);
    const copyButton = screen.getByRole('button', { name: /copy base64\(body\)/i });
    await user.click(copyButton);
    await waitFor(() => {
      expect(vi.mocked(encodeBase64)).toHaveBeenCalledWith('');
    });
  });

  it('renders with a different theme', () => {
    render(<BodyBlock {...defaultProps} theme="vs-light" />);
    expect(screen.getByTestId('monaco-editor')).toHaveAttribute('data-theme', 'vs-light');
  });

  it('The last thing is that the copy button exists and is clickable.', async () => {
    const user = userEvent.setup();
    render(<BodyBlock {...defaultProps} bodyText="test" />);
    const copyButton = screen.getByRole('button', { name: /copy base64\(body\)/i });
    expect(copyButton).toBeInTheDocument();
    await user.click(copyButton);
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
});
