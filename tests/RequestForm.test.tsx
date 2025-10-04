import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';
import { vi, describe, it, expect } from 'vitest';

import { METHODS } from '@/constants';

import messages from '../messages/en.json';
import RequestForm from '../src/components/client/Components/FormSection';

describe('RequestForm', () => {
  it('renders correctly and interacts with fields', async () => {
    const mockSetMethod = vi.fn();
    const mockSetUrl = vi.fn();
    const mockSendRequest = vi.fn();

    const method = METHODS[0];
    const url = 'https://jsonplaceholder.typicode.com/posts/1';
    const loading = false;

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <RequestForm
          method={method}
          setMethod={mockSetMethod}
          url={url}
          setUrl={mockSetUrl}
          sendRequest={mockSendRequest}
          loading={loading}
        />
      </NextIntlClientProvider>,
    );

    await waitFor(() => {
      const selectMethod = screen.getByDisplayValue(method);
      expect(selectMethod).toBeInTheDocument();
    });

    const selectMethod = screen.getByDisplayValue(method);
    expect(selectMethod).toBeInTheDocument();

    fireEvent.change(selectMethod, { target: { value: METHODS[1] } });
    expect(mockSetMethod).toHaveBeenCalledWith(METHODS[1]);

    const urlInput = screen.getByLabelText('Endpoint URL');
    fireEvent.change(urlInput, {
      target: { value: 'https://jsonplaceholder.typicode.com/posts/2' },
    });
    expect(mockSetUrl).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts/2');

    const sendButton = screen.getByText('Send');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockSendRequest).toHaveBeenCalledTimes(1);
    });
  });

  it('handles loading state correctly', () => {
    const mockSetMethod = vi.fn();
    const mockSetUrl = vi.fn();
    const mockSendRequest = vi.fn();

    const method = METHODS[0];
    const url = 'https://jsonplaceholder.typicode.com/posts/1';
    const loading = true;

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <RequestForm
          method={method}
          setMethod={mockSetMethod}
          url={url}
          setUrl={mockSetUrl}
          sendRequest={mockSendRequest}
          loading={loading}
        />
      </NextIntlClientProvider>,
    );

    const sendButton = screen.getByText('Send');
    expect(sendButton).toBeDisabled();
  });
});
