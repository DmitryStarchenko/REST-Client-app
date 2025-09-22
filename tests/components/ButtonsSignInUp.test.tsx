import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import ButtonsSignInUp from '@/components/layout/Header/ButtonsSignInUp/ButtonsSignInUp';

vi.mock('next-intl', () => ({
  useTranslations: () => {
    return (key: string) => {
      const translations: Record<string, string> = {
        signIn: 'Sign In',
        signUp: 'Sign Up',
      };
      return translations[key] || key;
    };
  },
}));

vi.mock('@/i18n/navigation', () => ({
  Link: vi.fn(({ children, href, className, ...props }) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  )),
}));

vi.mock('@/components/layout/Header/ButtonsSignInUp/ButtonsSignInUp.module.css', () => ({
  default: {
    navButton: 'navButton-class',
  },
}));

describe('ButtonsSignInUp', () => {
  it('should render sign in and sign up buttons', () => {
    render(<ButtonsSignInUp />);

    const signInButton = screen.getByText('Sign In');
    const signUpButton = screen.getByText('Sign Up');

    expect(signInButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });

  it('should have correct links for sign in and sign up', () => {
    render(<ButtonsSignInUp />);

    const signInLink = screen.getByText('Sign In').closest('a');
    const signUpLink = screen.getByText('Sign Up').closest('a');

    expect(signInLink).toHaveAttribute('href', '/login');
    expect(signUpLink).toHaveAttribute('href', '/registration');
  });

  it('should apply correct CSS classes', () => {
    render(<ButtonsSignInUp />);

    const buttons = screen.getAllByRole('link');

    buttons.forEach((button) => {
      expect(button).toHaveClass('navButton-class');
    });
  });

  it('should use translations correctly', () => {
    render(<ButtonsSignInUp />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('should render both buttons with correct structure', () => {
    const { container } = render(<ButtonsSignInUp />);

    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(2);

    const [signInLink, signUpLink] = links;
    expect(signInLink).toHaveTextContent('Sign In');
    expect(signUpLink).toHaveTextContent('Sign Up');
  });
});
