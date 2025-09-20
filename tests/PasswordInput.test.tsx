import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import PasswordInput from '../src/components/shared/PasswordInput/PasswordInput';

describe('PasswordInput', () => {
  const defaultProps = {
    label: 'Password',
    helperText: 'Enter your password',
  };

  it('renders correctly with default props', () => {
    render(<PasswordInput {...defaultProps} />);
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Enter your password')).toBeInTheDocument();
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles password visibility when icon button is clicked', async () => {
    const user = userEvent.setup();
    render(<PasswordInput {...defaultProps} />);

    const input = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button', {
      name: /display the password/i,
    });
    expect(input).toHaveAttribute('type', 'password');
    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('handles mouse down and up events on toggle button', async () => {
    const user = userEvent.setup();
    render(<PasswordInput {...defaultProps} />);
    const toggleButton = screen.getByRole('button', {
      name: /display the password/i,
    });
    await user.pointer([
      { keys: '[MouseLeft>]', target: toggleButton },
      { keys: '[/MouseLeft]', target: toggleButton },
    ]);

    expect(toggleButton).toBeInTheDocument();
  });

  it('shows error state when error prop is true', () => {
    render(<PasswordInput {...defaultProps} error={true} />);
    const input = screen.getByLabelText('Password');
    const helperText = screen.getByText('Enter your password');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(helperText).toHaveClass('Mui-error');
  });

  it('applies custom helper text when provided', () => {
    const customHelperText = 'Password must be at least 8 characters';
    render(<PasswordInput {...defaultProps} helperText={customHelperText} />);
    expect(screen.getByText(customHelperText)).toBeInTheDocument();
  });

  it('passes through additional input props', () => {
    render(<PasswordInput {...defaultProps} placeholder="Enter password here" disabled={true} />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('placeholder', 'Enter password here');
    expect(input).toBeDisabled();
  });

  it('renders correct icons based on visibility state', async () => {
    const user = userEvent.setup();
    render(<PasswordInput {...defaultProps} />);
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toHaveAttribute('aria-label', 'display the password');
    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-label', 'hide the password');
    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-label', 'display the password');
  });

  it('has correct accessibility attributes', () => {
    render(<PasswordInput {...defaultProps} />);

    const input = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button', {
      name: /display the password/i,
    });

    expect(input).toHaveAttribute('id', 'standard-adornment-password');
    expect(input).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveAttribute('aria-label', 'display the password');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    const { rerender } = render(<PasswordInput {...defaultProps} ref={ref} />);
    rerender(<PasswordInput {...defaultProps} ref={ref} />);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('DIV');
  });

  it('handles value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PasswordInput {...defaultProps} onChange={handleChange} />);
    const input = screen.getByLabelText('Password');
    await user.type(input, 'test');

    expect(handleChange).toHaveBeenCalled();
  });

  it('maintains focus during visibility toggle', async () => {
    const user = userEvent.setup();
    render(<PasswordInput {...defaultProps} />);
    const input = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button', {
      name: /display the password/i,
    });

    await user.click(input);
    expect(input).toHaveFocus();

    await user.click(toggleButton);
    expect(input).toHaveFocus();
  });
});
