import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { CopyButton } from '@/components/client/Shared/CopyButton';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'CopyButton.Copy content': 'Copy content',
    };
    return translations[key] || key;
  },
}));

const mockClipboard = {
  writeText: vi.fn(),
};
Object.defineProperty(global, 'navigator', {
  value: {
    clipboard: mockClipboard,
  },
  writable: true,
});

describe('CopyButton Component', () => {
  const mockGetValue = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetValue.mockReset();
    mockClipboard.writeText.mockReset();
  });

  test('renders copy button with tooltip', () => {
    mockGetValue.mockReturnValue('test content');
    render(<CopyButton getValue={mockGetValue} />);

    const copyButton = screen.getByRole('button', { name: 'Copy content' });
    expect(copyButton).toBeInTheDocument();
  });

  test('shows snackbar notification after successful copy', async () => {
    const user = userEvent.setup();
    mockGetValue.mockReturnValue('test content');
    mockClipboard.writeText.mockResolvedValue(undefined);

    render(<CopyButton getValue={mockGetValue} />);

    const copyButton = screen.getByRole('button', { name: 'Copy content' });
    await user.click(copyButton);

    // Snackbar should appear
    const snackbar = await screen.findByText('Copied!');
    expect(snackbar).toBeInTheDocument();
  });

  test('does not copy or show snackbar when getValue returns null/undefined', async () => {
    const user = userEvent.setup();
    mockGetValue.mockReturnValue(null as unknown as string);

    render(<CopyButton getValue={mockGetValue} />);

    const copyButton = screen.getByRole('button', { name: 'Copy content' });
    await user.click(copyButton);

    expect(mockGetValue).toHaveBeenCalledTimes(1);
    expect(mockClipboard.writeText).not.toHaveBeenCalled();

    // Snackbar should not appear
    await waitFor(() => {
      expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
    });
  });

  test('has correct styling and positioning', () => {
    mockGetValue.mockReturnValue('test content');
    render(<CopyButton getValue={mockGetValue} />);

    const copyButton = screen.getByRole('button', { name: 'Copy content' });

    // Check basic styling
    expect(copyButton).toHaveStyle({
      position: 'absolute',
      top: '8px',
      right: '8px',
    });
  });
});
