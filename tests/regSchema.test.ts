import { describe, it, expect } from 'vitest';

import { regSchema } from '../src/components/auth/RegForm/regSchema';

describe('regSchema', () => {
  describe('email validation', () => {
    it('validates a valid email', () => {
      const result = regSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });

      expect(result.success).toBe(true);
    });

    it('returns an error for an invalid email', () => {
      const result = regSchema.safeParse({
        email: 'invalid-email',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Enter valid email');
      }
    });

    it('returns an error for an empty email', () => {
      const result = regSchema.safeParse({
        email: '',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('password validation', () => {
    it('validates the correct password', () => {
      const result = regSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });

      expect(result.success).toBe(true);
    });

    it('returns an error for a short password', () => {
      const result = regSchema.safeParse({
        email: 'test@example.com',
        password: 'Short1!',
        confirmPassword: 'Short1!',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.message.includes('at least 8 characters')),
        ).toBe(true);
      }
    });

    it('returns an error if there is no digit', () => {
      const result = regSchema.safeParse({
        email: 'test@example.com',
        password: 'Password!',
        confirmPassword: 'Password!',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.message.includes('one number'))).toBe(
          true,
        );
      }
    });

    it('returns an error if there is no capital letter', () => {
      const result = regSchema.safeParse({
        email: 'test@example.com',
        password: 'password123!',
        confirmPassword: 'password123!',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.message.includes('uppercase letter')),
        ).toBe(true);
      }
    });

    it('returns an error if a lowercase letter is missing', () => {
      const result = regSchema.safeParse({
        email: 'test@example.com',
        password: 'PASSWORD123!',
        confirmPassword: 'PASSWORD123!',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.message.includes('lowercase letter')),
        ).toBe(true);
      }
    });

    it('returns an error if a special character is missing', () => {
      const result = regSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.message.includes('special character')),
        ).toBe(true);
      }
    });
  });

  describe('confirmPassword validation', () => {
    it('validates password matches', () => {
      const result = regSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });

      expect(result.success).toBe(true);
    });

    it('returns an error if the passwords do not match', () => {
      const result = regSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Different123!',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmPasswordError = result.error.issues.find((issue) =>
          issue.path.includes('confirmPassword'),
        );
        expect(confirmPasswordError?.message).toBe('Passwords do not match');
      }
    });

    it('does not check password matches if the main password is invalid', () => {
      const result = regSchema.safeParse({
        email: 'test@example.com',
        password: 'short',
        confirmPassword: 'different',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmPasswordError = result.error.issues.find(
          (issue) =>
            issue.path.includes('confirmPassword') && issue.message === 'Passwords do not match',
        );
        expect(confirmPasswordError).toBeUndefined();

        const passwordError = result.error.issues.find((issue) => issue.path.includes('password'));
        expect(passwordError).toBeDefined();
      }
    });
  });
});
