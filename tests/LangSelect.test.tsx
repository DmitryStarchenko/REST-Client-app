import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import '@testing-library/jest-dom';

import LangSelect from '@/components/client/RequestSection/Codegen/LangSelect';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('LangSelect Component', () => {
  const mockLangs = ['en_US', 'ru_RU', 'de_DE', 'java_okhttp', 'php_curl'];
  const mockSelectedLang = 'en_US';
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  test('renders select with correct test id', () => {
    render(
      <LangSelect langs={mockLangs} selectedLang={mockSelectedLang} onSelect={mockOnSelect} />,
    );

    const selectElement = screen.getByTestId('lang-select');
    expect(selectElement).toBeInTheDocument();
  });

  test('calls onSelect when language is changed', async () => {
    const user = userEvent.setup();

    render(
      <LangSelect langs={mockLangs} selectedLang={mockSelectedLang} onSelect={mockOnSelect} />,
    );

    const selectButton = screen.getByRole('combobox');

    await user.click(selectButton);

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'java okhttp' })).toBeInTheDocument();
    });

    const option = screen.getByRole('option', { name: 'java okhttp' });
    await user.click(option);

    expect(mockOnSelect).toHaveBeenCalledWith('java_okhttp');
  });

  test('has correct initial value', () => {
    render(<LangSelect langs={mockLangs} selectedLang="php_curl" onSelect={mockOnSelect} />);

    const selectInput = screen.getByTestId('lang-select').querySelector('input');
    expect(selectInput).toHaveAttribute('data-value', 'php_curl');
    expect(selectInput).toHaveValue('php_curl');
  });

  test('formats language names correctly in dropdown options', async () => {
    const user = userEvent.setup();

    render(
      <LangSelect langs={mockLangs} selectedLang={mockSelectedLang} onSelect={mockOnSelect} />,
    );

    const selectButton = screen.getByRole('combobox');
    await user.click(selectButton);

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'en US' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'ru RU' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'de DE' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'java okhttp' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'php curl' })).toBeInTheDocument();
    });
  });
});
