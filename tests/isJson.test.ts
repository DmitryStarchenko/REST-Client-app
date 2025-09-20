import { describe, it, expect } from 'vitest';

import { isJson } from '@/utils/isJson';

describe('isJson', () => {
  it('should return true for valid JSON object', () => {
    const jsonStr = '{"name":"John","age":30}';
    expect(isJson(jsonStr)).toBe(true);
  });

  it('should return true for valid JSON array', () => {
    const jsonStr = '[1,2,3]';
    expect(isJson(jsonStr)).toBe(true);
  });

  it('should return true for valid JSON number', () => {
    const jsonStr = '42';
    expect(isJson(jsonStr)).toBe(true);
  });

  it('should return true for valid JSON string', () => {
    const jsonStr = '"hello"';
    expect(isJson(jsonStr)).toBe(true);
  });

  it('should return true for valid JSON boolean', () => {
    expect(isJson('true')).toBe(true);
    expect(isJson('false')).toBe(true);
  });

  it('should return false for invalid JSON', () => {
    expect(isJson('{name:John}')).toBe(false);
    expect(isJson('hello')).toBe(false);
    expect(isJson('')).toBe(false);
    expect(isJson('123abc')).toBe(false);
  });
});
