import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormEvent } from 'react';
import React from 'react';
import { FieldError } from 'react-hook-form';
import { describe, it, expect, vi, beforeEach, afterEach, afterAll, beforeAll } from 'vitest';

import RegForm from '../src/components/auth/RegForm/RegForm';

const mockPush = vi.hoisted(() => vi.fn());
const mockSignUp = vi.hoisted(() => vi.fn());
const mockZodResolver = vi.hoisted(() => vi.fn());
const mockUseForm = vi.hoisted(() => vi.fn());

vi.mock('../src/i18n/navigation.ts', () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  redirect: vi.fn(),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useParams: vi.fn(() => ({})),
  useSelectedLayoutSegment: vi.fn(() => null),
  useSelectedLayoutSegments: vi.fn(() => []),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('../src/lib/supabase/client', () => ({
  default: {
    auth: {
      signUp: mockSignUp,
    },
  },
}));

vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: mockZodResolver,
}));

vi.mock('react-hook-form', () => ({
  useForm: mockUseForm,
  Controller: vi.fn(({ render }) => render({ field: {}, fieldState: {} })),
  FormProvider: vi.fn(({ children }) => children),
}));

vi.mock('../src/components/shared/PasswordInput/PasswordInput', () => ({
  default: ({
    id,
    label,
    error,
    helperText,
    ...props
  }: {
    id: string;
    label: string;
    error?: boolean;
    helperText?: string;
  }) => (
    <input
      id={id}
      type="password"
      placeholder={label}
      data-error={error}
      data-helpertext={helperText}
      {...props}
    />
  ),
}));

vi.mock('../src/components/auth/RegForm/regSchema', () => {
  const mockSchema = {
    parse: vi.fn(),
    safeParse: vi.fn(),
    _def: {},
    shape: {},
    refine: vi.fn(),
  };

  return {
    regSchema: mockSchema,
  };
});

vi.mock(import('../src/components/auth/RegForm/RegForm.module.css'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    form: 'test-form',
  };
});

const originalWindowLocation = window.location;
beforeAll(() => {
  Object.defineProperty(window, 'location', {
    value: {
      ...originalWindowLocation,
      origin: '/',
    },
    writable: true,
  });
});

afterAll(() => {
  Object.defineProperty(window, 'location', {
    value: originalWindowLocation,
    writable: true,
  });
});

describe('RegForm', () => {
  const mockHandleSubmit = vi.fn();
  const mockRegister = vi.fn();
  const mockSetError = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    mockZodResolver.mockReturnValue(vi.fn());

    mockHandleSubmit.mockImplementation((fn) => async (e?: FormEvent) => {
      e?.preventDefault?.();
      await fn({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });

    mockRegister.mockImplementation((name: string) => ({ name }));

    mockUseForm.mockReturnValue({
      handleSubmit: mockHandleSubmit,
      register: mockRegister,
      setError: mockSetError,
      formState: {
        errors: {},
      },
      watch: vi.fn(),
      getValues: vi.fn(),
      setValue: vi.fn(),
      reset: vi.fn(),
      clearErrors: vi.fn(),
    });

    mockSignUp.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls signUp with the correct data', async () => {
    render(<RegForm />);
    const submitButton = screen.getByText('Submit');
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: '/',
        },
      });
    });
  });

  it('redirects to the main page after successful registration', async () => {
    render(<RegForm />);
    const submitButton = screen.getByText('Submit');
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('sets an error when registration fails', async () => {
    const errorMessage = 'Registration failed';
    mockSignUp.mockRejectedValue(new Error(errorMessage));
    render(<RegForm />);
    const submitButton = screen.getByText('Submit');
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith('root', {
        type: 'custom',
        message: errorMessage,
      });
    });
  });

  it('shows a general error if formState.errors.root is present', async () => {
    const errorMessage = 'Some error occurred';
    mockUseForm.mockReturnValue({
      handleSubmit: mockHandleSubmit,
      register: mockRegister,
      formState: {
        errors: {
          root: {
            message: errorMessage,
            type: 'custom',
          } as FieldError,
        },
      },
    });
    render(<RegForm />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('shows an error for the password, password confirmation, and email fields', async () => {
    const confirmPasswordError = 'Passwords do not match';
    const emailError = 'Invalid email';
    const passwordError = 'Password is too short';
    mockUseForm.mockReturnValue({
      handleSubmit: mockHandleSubmit,
      register: mockRegister,
      formState: {
        errors: {
          confirmPassword: {
            message: confirmPasswordError,
            type: 'validate',
          } as FieldError,
          email: {
            message: emailError,
            type: 'validate',
          } as FieldError,
          password: {
            message: passwordError,
            type: 'validate',
          } as FieldError,
        },
      },
    });
    render(<RegForm />);
    const confirmPasswordInput = screen.getByPlaceholderText('confirm password');
    expect(confirmPasswordInput).toHaveAttribute('data-helpertext', confirmPasswordError);

    const emailHelperText = screen.getByText(emailError);
    expect(emailHelperText).toBeInTheDocument();
    expect(emailHelperText).toHaveClass('Mui-error');

    const passwordInput = screen.getByPlaceholderText('password');
    expect(passwordInput).toHaveAttribute('data-error', 'true');
    expect(passwordInput).toHaveAttribute('data-helpertext', passwordError);
  });

  it('sets the error from the supabase response', async () => {
    const supabaseError = {
      message: 'Email already exists',
      name: 'AuthError',
      status: 400,
    };
    mockSignUp.mockResolvedValue({ error: supabaseError });

    render(<RegForm />);
    const submitButton = screen.getByText('Submit');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith('root', {
        type: 'custom',
        message: 'An error occurred',
      });
    });
  });
});
