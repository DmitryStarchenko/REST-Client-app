import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import { useRouter } from '@/i18n/navigation';
import supabaseClient from '@/lib/supabase/client';

import LoginForm from '../src/components/auth/LoginForm/LoginForm';

vi.mock('react-hook-form', () => ({
  useForm: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('@/i18n/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
  default: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}));

vi.mock('@/components/shared/PasswordInput/PasswordInput', () => ({
  default: vi.fn(({ label, error, helperText, ...props }) => (
    <div>
      <label htmlFor="password">{label}</label>
      <input
        id="password"
        type="password"
        data-testid="password-input"
        data-error={error}
        {...props}
      />
      {helperText && <span data-testid="password-error">{helperText}</span>}
    </div>
  )),
}));

const mockUseForm = useForm as Mock;
const mockUseTranslations = useTranslations as Mock;
const mockUseRouter = useRouter as Mock;
const mockSupabaseClient = supabaseClient as unknown as {
  auth: {
    signInWithPassword: Mock;
  };
};

describe('LoginForm', () => {
  const mockRouterPush = vi.fn();
  const mockHandleSubmit = vi.fn();
  const mockRegister = vi.fn();
  const mockSetError = vi.fn();

  const mockTranslationAuth = vi.fn((key: string) => {
    const translations: Record<string, string> = {
      login: 'Login',
      email: 'Email',
      password: 'Password',
      Submit: 'Submit',
      'Enter valid email': 'Please enter a valid email',
      'Password must be at least 8 characters long': 'Password too short',
      'Password must contain at least one number': 'Add a number',
      'Password must contain at least one uppercase letter': 'Add uppercase',
      'Password must contain at least one lowercase letter': 'Add lowercase',
      'Password must contain at least one special character': 'Add special char',
      'An error occurred': 'An error occurred',
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseRouter.mockReturnValue({
      push: mockRouterPush,
    });

    mockUseTranslations.mockReturnValue(mockTranslationAuth);

    mockUseForm.mockReturnValue({
      handleSubmit: mockHandleSubmit,
      register: mockRegister,
      setError: mockSetError,
      formState: {
        errors: {},
        isSubmitting: false,
      },
    });

    mockRegister.mockImplementation((fieldName: string) => ({
      name: fieldName,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn(),
    }));

    mockHandleSubmit.mockImplementation((callback: () => void) => (e: Event) => {
      e.preventDefault();
      callback();
    });

    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      error: null,
      data: { user: null, session: null },
    });
  });

  it('renders login form with all fields', () => {
    render(<LoginForm />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('calls supabase signInWithPassword on form submission', async () => {
    const user = userEvent.setup();
    const testData = {
      email: 'test@example.com',
      password: 'ValidPass123!',
    };
    mockHandleSubmit.mockImplementation(
      (callback: (data: typeof testData) => void) => (e: Event) => {
        e.preventDefault();
        callback(testData);
      },
    );
    render(<LoginForm />);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);
    await waitFor(() => {
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: testData.email,
        password: testData.password,
      });
    });
  });

  it('redirects to home page on successful login', async () => {
    const user = userEvent.setup();
    const testData = {
      email: 'test@example.com',
      password: 'ValidPass123!',
    };
    mockHandleSubmit.mockImplementation(
      (callback: (data: typeof testData) => void) => (e: Event) => {
        e.preventDefault();
        callback(testData);
      },
    );
    render(<LoginForm />);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/');
    });
  });

  it('sets error when supabase returns error', async () => {
    const user = userEvent.setup();
    const testError = new Error('Invalid credentials');
    const testData = {
      email: 'test@example.com',
      password: 'ValidPass123!',
    };
    mockSupabaseClient.auth.signInWithPassword.mockRejectedValue(testError);
    mockHandleSubmit.mockImplementation(
      (callback: (data: typeof testData) => void) => (e: Event) => {
        e.preventDefault();
        callback(testData);
      },
    );
    render(<LoginForm />);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);
    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith('root', {
        type: 'custom',
        message: testError.message,
      });
    });
  });

  it('shows email error when formState contains email error', () => {
    const emailError = { message: 'Enter valid email', type: 'validation' };
    mockUseForm.mockReturnValue({
      handleSubmit: mockHandleSubmit,
      register: mockRegister,
      setError: mockSetError,
      formState: {
        errors: { email: emailError },
        isSubmitting: false,
      },
    });
    render(<LoginForm />);
    expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
  });

  it('shows password error when formState contains password error', () => {
    const passwordError = {
      message: 'Password must contain at least one number',
      type: 'validation',
    };
    mockUseForm.mockReturnValue({
      handleSubmit: mockHandleSubmit,
      register: mockRegister,
      setError: mockSetError,
      formState: {
        errors: { password: passwordError },
        isSubmitting: false,
      },
    });
    render(<LoginForm />);
    expect(screen.getByText('Add a number')).toBeInTheDocument();
  });

  it('shows root error when formState contains root error', () => {
    const rootError = { message: 'An error occurred', type: 'custom' };
    mockUseForm.mockReturnValue({
      handleSubmit: mockHandleSubmit,
      register: mockRegister,
      setError: mockSetError,
      formState: {
        errors: { root: rootError },
        isSubmitting: false,
      },
    });
    render(<LoginForm />);
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('disables submit button when isSubmitting is true', () => {
    mockUseForm.mockReturnValue({
      handleSubmit: mockHandleSubmit,
      register: mockRegister,
      setError: mockSetError,
      formState: {
        errors: {},
        isSubmitting: true,
      },
    });
    render(<LoginForm />);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeDisabled();
  });
});
