import { describe, it, expect } from 'vitest';

import { isJson } from '@/utils/isJson';

describe('isJson', () => {
  it('should return true for valid JSON strings', () => {
    expect(isJson('{}')).toBe(true);
    expect(isJson('{"key": "value"}')).toBe(true);
    expect(isJson('[]')).toBe(true);
    expect(isJson('[1, 2, 3]')).toBe(true);
    expect(isJson('true')).toBe(true);
    expect(isJson('null')).toBe(true);
    expect(isJson('42')).toBe(true);
  });

  it('should return false for invalid JSON strings', () => {
    expect(isJson('')).toBe(false);
    expect(isJson('{')).toBe(false);
    expect(isJson('}')).toBe(false);
    expect(isJson('{key: "value"}')).toBe(false);
    expect(isJson("{'key': 'value'}")).toBe(false);
    expect(isJson('undefined')).toBe(false);
    expect(isJson('text')).toBe(false);
  });

  it('should handle whitespace in JSON', () => {
    expect(isJson('  { "key": "value" }  ')).toBe(true);
    expect(isJson('\n{"key": "value"}\n')).toBe(true);
  });
});
