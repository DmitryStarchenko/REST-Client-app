import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, vi } from 'vitest';

import HeadersBlock from '@/components/client/RequestSection/Headers';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/utils', () => ({
  uid: vi.fn(() => 'unique-id'),
}));

describe('HeadersBlock', () => {
  const initialHeaders = [{ id: '1', key: 'Content-Type', value: 'application/json' }];

  it('renders initial headers', () => {
    const setHeaders = vi.fn();
    render(<HeadersBlock headers={initialHeaders} setHeaders={setHeaders} />);

    expect(screen.getByPlaceholderText('Key')).toHaveValue('Content-Type');
    expect(screen.getByPlaceholderText('Value')).toHaveValue('application/json');
  });

  it('adds a new empty header when last header is filled', () => {
    const setHeaders = vi.fn();
    render(<HeadersBlock headers={initialHeaders} setHeaders={setHeaders} />);

    const keyInput = screen.getByPlaceholderText('Key');
    fireEvent.change(keyInput, { target: { value: 'Authorization' } });

    expect(setHeaders).toHaveBeenCalledWith([
      { id: '1', key: 'Authorization', value: 'application/json' },
      { id: 'unique-id', key: '', value: '' },
    ]);
  });

  it('removes a header when delete button is clicked', () => {
    const setHeaders = vi.fn();
    const headers = [
      { id: '1', key: 'Content-Type', value: 'application/json' },
      { id: '2', key: 'Authorization', value: 'Bearer token' },
    ];
    render(<HeadersBlock headers={headers} setHeaders={setHeaders} />);

    const deleteButtons = screen.getAllByRole('button');
    fireEvent.click(deleteButtons[0]);

    expect(setHeaders).toHaveBeenCalledWith([
      { id: '2', key: 'Authorization', value: 'Bearer token' },
    ]);
  });

  it('shows tooltip for incomplete headers', async () => {
    const incompleteHeader = [{ id: '2', key: 'Authorization', value: '' }];
    const setHeaders = vi.fn();
    render(<HeadersBlock headers={incompleteHeader} setHeaders={setHeaders} />);

    const infoIcon = screen.getByTestId('info-icon');
    await userEvent.hover(infoIcon);

    expect(await screen.findByText('Tooltip')).toBeInTheDocument();
  });
});
