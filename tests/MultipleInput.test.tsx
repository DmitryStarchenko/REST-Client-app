import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { IVariable } from '@/types';

import MultipleInputs from '../src/components/shared/MultipleInput/MultipleInput';

vi.mock('@mui/icons-material/Add', () => ({
  default: () => <span data-testid="add-icon">+</span>,
}));

vi.mock('@mui/icons-material/Remove', () => ({
  default: () => <span data-testid="remove-icon">-</span>,
}));

describe('MultipleInputs', () => {
  const mockOnChange = vi.fn();
  const mockInputs: IVariable[] = [
    { id: 1, key: 'key1', value: 'value1' },
    { id: 2, key: 'key2', value: 'value2' },
  ];

  const defaultProps = {
    inputs: mockInputs,
    onChange: mockOnChange,
    label: 'Test Label',
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders correctly with provided props', () => {
    render(<MultipleInputs {...defaultProps} />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByTestId('add-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('remove-icon')).toHaveLength(2);
    expect(screen.getAllByPlaceholderText('Key')).toHaveLength(2);
    expect(screen.getAllByPlaceholderText('Value')).toHaveLength(2);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders correct number of input rows', () => {
    render(<MultipleInputs {...defaultProps} />);
    const keyInputs = screen.getAllByPlaceholderText('Key');
    const valueInputs = screen.getAllByPlaceholderText('Value');
    const removeButtons = screen.getAllByTestId('remove-icon');
    expect(keyInputs).toHaveLength(2);
    expect(valueInputs).toHaveLength(2);
    expect(removeButtons).toHaveLength(2);
  });

  it('calls onChange without parameters when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<MultipleInputs {...defaultProps} />);
    const addButton = screen.getByTestId('add-icon');
    await user.click(addButton);
    expect(mockOnChange).toHaveBeenCalledWith();
  });

  it('calls onChange with id when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(<MultipleInputs {...defaultProps} />);
    const removeButtons = screen.getAllByTestId('remove-icon');
    await user.click(removeButtons[0]);
    expect(mockOnChange).toHaveBeenCalledWith(1);
  });

  it('displays correct values in inputs', () => {
    render(<MultipleInputs {...defaultProps} />);
    const keyInputs = screen.getAllByPlaceholderText('Key') as HTMLInputElement[];
    const valueInputs = screen.getAllByPlaceholderText('Value') as HTMLInputElement[];
    expect(keyInputs[0].value).toBe('key1');
    expect(keyInputs[1].value).toBe('key2');
    expect(valueInputs[0].value).toBe('value1');
    expect(valueInputs[1].value).toBe('value2');
  });

  it('renders correctly with empty inputs array', () => {
    const propsWithEmptyInputs = {
      ...defaultProps,
      inputs: [],
    };
    render(<MultipleInputs {...propsWithEmptyInputs} />);
    expect(screen.queryAllByPlaceholderText('Key')).toHaveLength(0);
    expect(screen.queryAllByPlaceholderText('Value')).toHaveLength(0);
    expect(screen.queryAllByTestId('remove-icon')).toHaveLength(0);
  });

  it('applies correct flex style to value TextField', () => {
    render(<MultipleInputs {...defaultProps} />);
    const valueInputs = screen.getAllByPlaceholderText('Value');
    const valueInputContainer = valueInputs[0].closest('.MuiTextField-root');
    expect(valueInputContainer).toHaveStyle({ flex: 1 });
  });
});
