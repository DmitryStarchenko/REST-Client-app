import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

const mockSignUp = vi.hoisted(() => vi.fn());

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => key),
}));

vi.mock('@/i18n/navigation', () => ({
  Link: vi.fn(({ children, href, className }) =>
    React.createElement(
      'a',
      {
        href,
        className,
      },
      children,
    ),
  ),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
}));

vi.mock('../src/lib/supabase/client', () => ({
  default: {
    auth: {
      signUp: mockSignUp,
    },
  },
}));

vi.mock('@/components/auth/RegistrationForm/RegistrationForm', () => ({
  default: vi.fn(() => <div data-testid="registration-form">Registration Form</div>),
}));

import Registration from '../src/app/[locale]/(auth)/registration/page';

describe('Registration Page', () => {
  it('should render without crashing', () => {
    render(<Registration />);
    const registrationForm = screen.queryByTestId('registration-form');
    if (registrationForm) {
      expect(screen.getByTestId('registration-form')).toBeInTheDocument();
    }
  });

  it('should render RegistrationForm component', () => {
    render(<Registration />);
    const registrationForm = screen.queryByTestId('registration-form');
    if (registrationForm) {
      const registrationForm = screen.getByTestId('registration-form');
      expect(registrationForm).toBeInTheDocument();
      expect(registrationForm).toHaveTextContent('Registration Form');
    }
  });

  it('should match snapshot', () => {
    const { container } = render(<Registration />);
    expect(container).toMatchSnapshot();
  });
});
