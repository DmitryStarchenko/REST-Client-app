import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import MultipleInputs from '@/components/shared/MultipleInput/MultipleInput';
import type { IVariable } from '@/types';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'MultipleInputs.Save': 'Save',
    };
    return translations[key] || key;
  },
}));

describe('MultipleInputs', () => {
  const mockOnChange = vi.fn();
  const mockInputs: IVariable[] = [
    { id: 1, key: 'API_URL', value: 'https://api.example.com' },
    { id: 2, key: 'API_KEY', value: 'secret-key' },
  ];

  const defaultProps = {
    inputs: mockInputs,
    onChange: mockOnChange,
    label: 'Variables',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with correct label and inputs', () => {
    render(<MultipleInputs {...defaultProps} />);

    expect(screen.getByText('Variables')).toBeInTheDocument();
    expect(screen.getByLabelText('add')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('Key')).toHaveLength(2);
    expect(screen.getAllByPlaceholderText('Value')).toHaveLength(2);
    expect(screen.getAllByLabelText('remove')).toHaveLength(2);

    const keyInputs = screen.getAllByPlaceholderText('Key');
    const valueInputs = screen.getAllByPlaceholderText('Value');

    expect(keyInputs[0]).toHaveValue('API_URL');
    expect(valueInputs[0]).toHaveValue('https://api.example.com');
    expect(keyInputs[1]).toHaveValue('API_KEY');
    expect(valueInputs[1]).toHaveValue('secret-key');
  });

  it('should call onChange without arguments when add button is clicked', () => {
    render(<MultipleInputs {...defaultProps} />);

    const addButton = screen.getByLabelText('add');
    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalledWith();
  });

  it('should call onChange with id when remove button is clicked', () => {
    render(<MultipleInputs {...defaultProps} />);

    const removeButtons = screen.getAllByLabelText('remove');
    fireEvent.click(removeButtons[0]);

    expect(mockOnChange).toHaveBeenCalledWith(1);
  });

  it('should call onChange with key update when key input is changed', () => {
    render(<MultipleInputs {...defaultProps} />);

    const keyInputs = screen.getAllByPlaceholderText('Key');
    fireEvent.change(keyInputs[0], { target: { value: 'NEW_KEY' } });

    expect(mockOnChange).toHaveBeenCalledWith(1, { key: 'NEW_KEY' });
  });

  it('should call onChange with value update when value input is changed', () => {
    render(<MultipleInputs {...defaultProps} />);

    const valueInputs = screen.getAllByPlaceholderText('Value');
    fireEvent.change(valueInputs[1], { target: { value: 'new-secret' } });

    expect(mockOnChange).toHaveBeenCalledWith(2, { value: 'new-secret' });
  });

  it('should handle empty inputs array', () => {
    render(<MultipleInputs {...defaultProps} inputs={[]} />);

    expect(screen.getByText('Variables')).toBeInTheDocument();
    expect(screen.getByLabelText('add')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Key')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Value')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('remove')).not.toBeInTheDocument();
  });

  it('should render correct number of inputs based on array length', () => {
    const singleInput: IVariable[] = [{ id: 1, key: 'SINGLE', value: 'value' }];

    render(<MultipleInputs {...defaultProps} inputs={singleInput} />);

    expect(screen.getAllByPlaceholderText('Key')).toHaveLength(1);
    expect(screen.getAllByPlaceholderText('Value')).toHaveLength(1);
    expect(screen.getAllByLabelText('remove')).toHaveLength(1);
  });

  it('should handle inputs with empty values', () => {
    const emptyInputs: IVariable[] = [
      { id: 1, key: '', value: '' },
      { id: 2, key: 'KEY_ONLY', value: '' },
      { id: 3, key: '', value: 'VALUE_ONLY' },
    ];

    render(<MultipleInputs {...defaultProps} inputs={emptyInputs} />);

    const keyInputs = screen.getAllByPlaceholderText('Key');
    const valueInputs = screen.getAllByPlaceholderText('Value');

    expect(keyInputs[0]).toHaveValue('');
    expect(valueInputs[0]).toHaveValue('');
    expect(keyInputs[1]).toHaveValue('KEY_ONLY');
    expect(valueInputs[1]).toHaveValue('');
    expect(keyInputs[2]).toHaveValue('');
    expect(valueInputs[2]).toHaveValue('VALUE_ONLY');
  });

  it('should call onChange when input value is changed', () => {
    render(<MultipleInputs {...defaultProps} />);

    const keyInputs = screen.getAllByPlaceholderText('Key');
    const firstInput = keyInputs[0];

    fireEvent.change(firstInput, { target: { value: 'UPDATED' } });

    expect(mockOnChange).toHaveBeenCalledWith(1, { key: 'UPDATED' });
    expect(firstInput).toHaveValue('API_URL');
  });
});
