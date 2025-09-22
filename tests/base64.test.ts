import { describe, it, expect, vi, beforeEach } from 'vitest';

import { encodeBase64, decodeBase64 } from '@/utils/base64';

describe('Base64 functions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('encodeBase64', () => {
    it('should encode string correctly in Node.js (Buffer)', () => {
      vi.stubGlobal('window', undefined);

      const input = 'Hello, World!';
      const encoded = encodeBase64(input);
      expect(encoded).toBe(Buffer.from(input, 'utf8').toString('base64'));
    });

    it('should encode string correctly in browser (btoa)', () => {
      const mockBtoa = vi.fn((str) => `btoa-${str}`);
      vi.stubGlobal('window', {});
      vi.stubGlobal('btoa', mockBtoa);

      const input = 'Hello';
      encodeBase64(input);
      expect(mockBtoa).toHaveBeenCalled();
    });
  });

  describe('decodeBase64', () => {
    it('should decode string correctly in Node.js (Buffer)', () => {
      vi.stubGlobal('window', undefined);

      const input = Buffer.from('Test string', 'utf8').toString('base64');
      const decoded = decodeBase64(input);
      expect(decoded).toBe('Test string');
    });

    it('should decode string correctly in browser (atob)', () => {
      vi.stubGlobal('window', {});
      const input = 'dGVzdA==';
      const binary = 'test';
      const mockAtob = vi.fn(() => binary);
      const mockTextDecoder = vi.fn(() => ({ decode: vi.fn(() => 'test') }));
      vi.stubGlobal('atob', mockAtob);
      vi.stubGlobal('TextDecoder', mockTextDecoder);

      const result = decodeBase64(input);
      expect(mockAtob).toHaveBeenCalledWith(input);
      expect(result).toBe('test');
    });

    it('should return empty string for empty input', () => {
      expect(decodeBase64('')).toBe('');
    });

    it('should return input if atob fails', () => {
      vi.stubGlobal('window', {});
      vi.stubGlobal('atob', () => {
        throw new Error('fail');
      });

      const input = 'invalid';
      const result = decodeBase64(input);
      expect(result).toBe(input);
    });
  });
});
