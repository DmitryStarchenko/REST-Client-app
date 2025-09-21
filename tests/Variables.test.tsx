import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Variables from '@/components/variables/Variables';
import { IVariable } from '@/types';

vi.mock('usehooks-ts', () => ({
  useLocalStorage: vi.fn(),
}));

vi.mock('@mui/material', () => ({
  Alert: ({
    children,
    onClose,
    severity,
  }: {
    children: React.ReactNode;
    onClose: () => void;
    severity: string;
  }) => (
    <div data-testid="alert" data-severity={severity}>
      {children}
      <button onClick={onClose} data-testid="alert-close">
        Close
      </button>
    </div>
  ),
  Box: ({ children, sx }: { children: React.ReactNode; sx?: object }) => (
    <div data-testid="box" style={sx as React.CSSProperties}>
      {children}
    </div>
  ),
  Slide: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Snackbar: ({
    children,
    open,
    onClose,
    autoHideDuration,
  }: {
    children: React.ReactNode;
    open: boolean;
    onClose: () => void;
    autoHideDuration?: number;
    anchorOrigin?: object;
  }) =>
    open ? (
      <div data-testid="snackbar" data-auto-hide={autoHideDuration}>
        {children}
        <button onClick={onClose} data-testid="snackbar-close">
          Close Snackbar
        </button>
      </div>
    ) : null,
}));

vi.mock('@/components/shared/MultipleInput/MultipleInput', () => ({
  default: ({
    inputs,
    onChange,
    label,
  }: {
    inputs: IVariable[];
    onChange: (id?: number, input?: { key?: string; value?: string }) => void;
    label: string;
  }) => (
    <div data-testid="multiple-inputs">
      <div data-testid="label">{label}</div>
      <button data-testid="add-variable" onClick={() => onChange()}>
        Add Variable
      </button>
      {inputs.map((input) => (
        <div key={input.id} data-testid={`variable-${input.id}`}>
          <input
            data-testid={`key-input-${input.id}`}
            placeholder="Key"
            value={input.key}
            onChange={(e) => onChange(input.id, { key: e.target.value })}
          />
          <input
            data-testid={`value-input-${input.id}`}
            placeholder="Value"
            value={input.value}
            onChange={(e) => onChange(input.id, { value: e.target.value })}
          />
          <button data-testid={`remove-variable-${input.id}`} onClick={() => onChange(input.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock('@/constants', () => ({
  VARIABLES_KEY: 'test-variables-key',
}));

describe('Variables Component', () => {
  const mockVariables: IVariable[] = [
    { id: 1, key: 'API_URL', value: 'https://api.example.com' },
    { id: 2, key: 'TOKEN', value: 'abc123' },
  ];

  let mockUseLocalStorage: ReturnType<typeof vi.fn>;
  let mockSetVariables: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();

    const { useLocalStorage } = await vi.importMock('usehooks-ts');
    mockUseLocalStorage = useLocalStorage as ReturnType<typeof vi.fn>;
    mockSetVariables = vi.fn();

    mockUseLocalStorage.mockReturnValue([[], mockSetVariables]);
  });

  it('should render with empty variables initially', () => {
    render(<Variables />);

    expect(screen.getByTestId('multiple-inputs')).toBeInTheDocument();
    expect(screen.getByTestId('label')).toHaveTextContent('Variables');
    expect(screen.getByTestId('add-variable')).toBeInTheDocument();
  });

  it('should render existing variables from localStorage', () => {
    mockUseLocalStorage.mockReturnValue([mockVariables, mockSetVariables]);

    render(<Variables />);

    expect(screen.getByTestId('variable-1')).toBeInTheDocument();
    expect(screen.getByTestId('variable-2')).toBeInTheDocument();
    expect(screen.getByTestId('key-input-1')).toHaveValue('API_URL');
    expect(screen.getByTestId('value-input-1')).toHaveValue('https://api.example.com');
    expect(screen.getByTestId('key-input-2')).toHaveValue('TOKEN');
    expect(screen.getByTestId('value-input-2')).toHaveValue('abc123');
  });

  it('should add a new variable when add button is clicked', async () => {
    const user = userEvent.setup();

    render(<Variables />);

    await user.click(screen.getByTestId('add-variable'));

    expect(mockSetVariables).toHaveBeenCalledWith(expect.any(Function));

    const setVariablesCall = mockSetVariables.mock.calls[0][0];
    const result = setVariablesCall([]);

    expect(result).toEqual([{ id: 1, key: '', value: '' }]);
  });

  it('should add variable with correct ID when existing variables present', async () => {
    const user = userEvent.setup();
    mockUseLocalStorage.mockReturnValue([mockVariables, mockSetVariables]);

    render(<Variables />);

    await user.click(screen.getByTestId('add-variable'));

    const setVariablesCall = mockSetVariables.mock.calls[0][0];
    const result = setVariablesCall(mockVariables);

    expect(result).toEqual([...mockVariables, { id: 3, key: '', value: '' }]);
  });

  it('should update variable key when input changes', async () => {
    const user = userEvent.setup();
    const freshMockVariables = [
      { id: 1, key: 'API_URL', value: 'https://api.example.com' },
      { id: 2, key: 'TOKEN', value: 'abc123' },
    ];
    mockUseLocalStorage.mockReturnValue([freshMockVariables, mockSetVariables]);

    render(<Variables />);

    const keyInput = screen.getByTestId('key-input-1');
    await user.type(keyInput, 'X');

    expect(mockSetVariables).toHaveBeenCalled();

    const lastCall = mockSetVariables.mock.calls[mockSetVariables.mock.calls.length - 1];
    expect(lastCall[0]).toEqual([
      { id: 1, key: 'API_URLX', value: 'https://api.example.com' },
      { id: 2, key: 'TOKEN', value: 'abc123' },
    ]);
  });

  it('should update variable value when input changes', async () => {
    const user = userEvent.setup();
    const freshMockVariables = [
      { id: 1, key: 'API_URL', value: 'https://api.example.com' },
      { id: 2, key: 'TOKEN', value: 'abc123' },
    ];
    mockUseLocalStorage.mockReturnValue([freshMockVariables, mockSetVariables]);

    render(<Variables />);

    const valueInput = screen.getByTestId('value-input-2');
    await user.type(valueInput, 'X');

    expect(mockSetVariables).toHaveBeenCalled();

    const lastCall = mockSetVariables.mock.calls[mockSetVariables.mock.calls.length - 1];
    expect(lastCall[0]).toEqual([
      { id: 1, key: 'API_URL', value: 'https://api.example.com' },
      { id: 2, key: 'TOKEN', value: 'abc123X' },
    ]);
  });

  it('should remove variable when remove button is clicked', async () => {
    const user = userEvent.setup();
    const freshMockVariables = [
      { id: 1, key: 'API_URL', value: 'https://api.example.com' },
      { id: 2, key: 'TOKEN', value: 'abc123' },
    ];
    mockUseLocalStorage.mockReturnValue([freshMockVariables, mockSetVariables]);

    render(<Variables />);

    await user.click(screen.getByTestId('remove-variable-1'));

    expect(mockSetVariables).toHaveBeenCalledWith(expect.any(Function));

    const setVariablesCall = mockSetVariables.mock.calls[0][0];
    const result = setVariablesCall(freshMockVariables);

    expect(result).toEqual([{ id: 2, key: 'TOKEN', value: 'abc123' }]);
  });

  it('should handle duplicate key validation logic', async () => {
    const user = userEvent.setup();
    const freshMockVariables = [
      { id: 1, key: 'API_URL', value: 'https://api.example.com' },
      { id: 2, key: 'TOKEN', value: 'abc123' },
    ];
    mockUseLocalStorage.mockReturnValue([freshMockVariables, mockSetVariables]);

    render(<Variables />);

    const keyInput = screen.getByTestId('key-input-2');
    await user.clear(keyInput);

    await user.type(keyInput, 'API_URL');

    expect(mockSetVariables).toHaveBeenCalled();
    expect(screen.getByTestId('key-input-2')).toBeInTheDocument();
  });

  it('should show error when invalid key format is entered', async () => {
    const user = userEvent.setup();
    mockUseLocalStorage.mockReturnValue([mockVariables, mockSetVariables]);

    render(<Variables />);

    const keyInput = screen.getByTestId('key-input-1');
    await user.clear(keyInput);
    await user.type(keyInput, '!@#$');

    await waitFor(() => {
      expect(screen.getByTestId('snackbar')).toBeInTheDocument();
    });

    expect(screen.getByTestId('alert')).toHaveTextContent(
      'Variable key should be contain only letters, digits, or underscore!',
    );
  });

  it('should show error for empty key', async () => {
    const user = userEvent.setup();
    mockUseLocalStorage.mockReturnValue([mockVariables, mockSetVariables]);

    render(<Variables />);

    const keyInput = screen.getByTestId('key-input-1');
    await user.clear(keyInput);

    await waitFor(() => {
      expect(screen.getByTestId('snackbar')).toBeInTheDocument();
    });

    expect(screen.getByTestId('alert')).toHaveTextContent(
      'Variable key should be contain only letters, digits, or underscore!',
    );
  });

  it('should clear error when valid key is entered after invalid one', async () => {
    const user = userEvent.setup();
    mockUseLocalStorage.mockReturnValue([mockVariables, mockSetVariables]);

    render(<Variables />);

    const keyInput = screen.getByTestId('key-input-1');

    await user.clear(keyInput);
    await user.type(keyInput, '!@#');

    await waitFor(() => {
      expect(screen.getByTestId('snackbar')).toBeInTheDocument();
    });

    await user.clear(keyInput);
    await user.type(keyInput, 'VALID_KEY');

    await waitFor(() => {
      expect(screen.queryByTestId('snackbar')).not.toBeInTheDocument();
    });
  });

  it('should close error snackbar when close button is clicked', async () => {
    const user = userEvent.setup();
    mockUseLocalStorage.mockReturnValue([mockVariables, mockSetVariables]);

    render(<Variables />);

    const keyInput = screen.getByTestId('key-input-1');
    await user.clear(keyInput);

    await waitFor(() => {
      expect(screen.getByTestId('snackbar')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('alert-close'));

    await waitFor(() => {
      expect(screen.queryByTestId('snackbar')).not.toBeInTheDocument();
    });
  });

  it('should auto-hide error snackbar after timeout', async () => {
    const user = userEvent.setup();
    const freshMockVariables = [
      { id: 1, key: 'API_URL', value: 'https://api.example.com' },
      { id: 2, key: 'TOKEN', value: 'abc123' },
    ];
    mockUseLocalStorage.mockReturnValue([freshMockVariables, mockSetVariables]);

    render(<Variables />);

    const keyInput = screen.getByTestId('key-input-1');
    await user.clear(keyInput);

    await waitFor(() => {
      const snackbar = screen.getByTestId('snackbar');
      expect(snackbar).toBeInTheDocument();
      expect(snackbar).toHaveAttribute('data-auto-hide', '2000');
    });
  });

  it('should handle valid alphanumeric and underscore keys without error', async () => {
    const user = userEvent.setup();

    render(<Variables />);

    await user.click(screen.getByTestId('add-variable'));

    expect(mockSetVariables).toHaveBeenCalled();

    const newVariable = { id: 1, key: '', value: '' };
    mockUseLocalStorage.mockReturnValue([[newVariable], mockSetVariables]);

    render(<Variables />);

    const keyInput = screen.getByTestId('key-input-1');
    await user.type(keyInput, 'VALID_KEY');

    expect(screen.queryByTestId('snackbar')).not.toBeInTheDocument();
  });

  it('should use correct localStorage key from constants', () => {
    render(<Variables />);

    expect(mockUseLocalStorage).toHaveBeenCalledWith('test-variables-key', []);
  });
});
