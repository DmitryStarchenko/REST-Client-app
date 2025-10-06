import { fail } from 'assert';

import { describe, it, expect } from 'vitest';

import { METHODS } from '@/constants';
import { isValidMethod } from '@/utils/isValidMethod';

describe('isValidMethod', () => {
  it('returns true for all valid HTTP methods', () => {
    METHODS.forEach((method) => {
      expect(isValidMethod(method)).toBe(true);
    });
  });

  it('returns false for invalid HTTP methods', () => {
    const invalidMethods = [
      'get',
      'Get',
      'POST ',
      'GETT',
      'CONNECT',
      'TRACE',
      '',
      '   ',
      null,
      undefined,
      123,
      true,
      false,
      {},
      [],
    ];

    invalidMethods.forEach((method) => {
      expect(isValidMethod(method as string)).toBe(false);
    });
  });

  it('works correctly with TypeScript type guard', () => {
    const testMethod = 'GET';

    if (isValidMethod(testMethod)) {
      expect(testMethod).toBe('GET');
      expect(METHODS).toContain(testMethod);
    } else {
      fail('The GET method must be valid');
    }

    const invalidMethod = 'INVALID';
    if (isValidMethod(invalidMethod)) {
      fail('The INVALID method should not be valid');
    } else {
      expect(invalidMethod).toBe('INVALID');
      expect(METHODS).not.toContain(invalidMethod);
    }
  });

  it('Handles edge cases', () => {
    expect(isValidMethod('')).toBe(false);
    expect(isValidMethod('   ')).toBe(false);
    expect(isValidMethod('GET@')).toBe(false);
    expect(isValidMethod('POST#')).toBe(false);
    expect(isValidMethod('GET'.repeat(10))).toBe(false);
  });

  it('Matches the exact METHODS list', () => {
    expect(isValidMethod('GET')).toBe(true);
    expect(isValidMethod('POST')).toBe(true);
    expect(isValidMethod('PUT')).toBe(true);
    expect(isValidMethod('PATCH')).toBe(true);
    expect(isValidMethod('DELETE')).toBe(true);
    expect(isValidMethod('HEAD')).toBe(true);
    expect(isValidMethod('OPTIONS')).toBe(true);
    expect(isValidMethod('CONNECT')).toBe(false);
    expect(isValidMethod('TRACE')).toBe(false);
    expect(isValidMethod('PURGE')).toBe(false);
  });

  it('Works correctly with TypeScript types', () => {
    const possibleMethods: string[] = ['GET', 'POST', 'INVALID'];

    const validMethods = possibleMethods.filter(isValidMethod);

    expect(validMethods).toEqual(['GET', 'POST']);
    expect(validMethods.every((method) => METHODS.includes(method))).toBe(true);
  });
});
