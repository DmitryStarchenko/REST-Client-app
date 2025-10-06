import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/components/auth/LoginForm/LoginForm', () => ({
  default: vi.fn(() => <div data-testid="login-form">Login Form</div>),
}));

import Login from '../src/app/[locale]/(auth)/login/page';

describe('Login Page', () => {
  it('should render without crashing', () => {
    render(<Login />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('should render LoginForm component', () => {
    render(<Login />);

    const loginForm = screen.getByTestId('login-form');
    expect(loginForm).toBeInTheDocument();
    expect(loginForm).toHaveTextContent('Login Form');
  });

  it('should match snapshot', () => {
    const { container } = render(<Login />);
    expect(container).toMatchSnapshot();
  });
});
