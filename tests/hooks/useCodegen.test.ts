import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useCodegen } from '@/hooks';
import { generateSnippet } from '@/utils';
import { isJson } from '@/utils';

vi.mock('@/utils', () => ({
  generateSnippet: vi.fn(),
  isJson: vi.fn(),
}));

vi.mock('httpsnippet', () => {
  return {
    default: vi.fn(),
  };
});

describe('useCodegen', () => {
  const mockMethod = 'POST';
  const mockUrl = 'https://api.example.com/users';
  const mockHeaders = [
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Authorization', value: 'Bearer token123' },
  ];
  const mockBody = JSON.stringify({ name: 'John', age: 30 });

  const mockSnippetOutputs = {
    curl: 'curl -X POST https://api.example.com/users',
    fetch: "fetch('https://api.example.com/users', { method: 'POST' })",
    python: 'requests.post("https://api.example.com/users")',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isJson).mockReturnValue(true);
    vi.mocked(generateSnippet).mockReturnValue(mockSnippetOutputs);
  });

  it('should generate code snippet for supported language', async () => {
    const { result } = renderHook(() => useCodegen(mockMethod, mockUrl, mockHeaders, mockBody));

    const snippet = await result.current.generateForLang('curl');

    expect(snippet).toBe(mockSnippetOutputs.curl);
    expect(generateSnippet).toHaveBeenCalledOnce();
  });

  it('should handle JSON body correctly', async () => {
    vi.mocked(isJson).mockReturnValue(true);

    const { result } = renderHook(() => useCodegen(mockMethod, mockUrl, mockHeaders, mockBody));

    await result.current.generateForLang('curl');

    expect(isJson).toHaveBeenCalledWith(mockBody);
  });

  it('should handle non-JSON body correctly', async () => {
    const nonJsonBody = 'plain text body';
    vi.mocked(isJson).mockReturnValue(false);

    const { result } = renderHook(() => useCodegen(mockMethod, mockUrl, mockHeaders, nonJsonBody));

    await result.current.generateForLang('curl');

    expect(isJson).toHaveBeenCalledWith(nonJsonBody);
  });

  it('should handle undefined body', async () => {
    const { result } = renderHook(() => useCodegen(mockMethod, mockUrl, mockHeaders));

    await result.current.generateForLang('curl');

    expect(isJson).not.toHaveBeenCalled();
  });

  it('should throw error for unsupported language', async () => {
    vi.mocked(generateSnippet).mockReturnValue({
      ...mockSnippetOutputs,
    });

    const { result } = renderHook(() => useCodegen(mockMethod, mockUrl, mockHeaders, mockBody));

    await expect(result.current.generateForLang('unsupported-lang')).rejects.toThrow(
      'Language unsupported-lang not supported',
    );
  });

  it('should throw error when generateSnippet fails', async () => {
    vi.mocked(generateSnippet).mockImplementation(() => {
      throw new Error('Generation failed');
    });

    const { result } = renderHook(() => useCodegen(mockMethod, mockUrl, mockHeaders, mockBody));

    await expect(result.current.generateForLang('curl')).rejects.toThrow(
      'Codegen failed: Generation failed',
    );
  });

  it('should memoize function with dependencies', async () => {
    const { result, rerender } = renderHook(
      ({ method, url, headers, body }) => useCodegen(method, url, headers, body),
      {
        initialProps: {
          method: mockMethod,
          url: mockUrl,
          headers: mockHeaders,
          body: mockBody,
        },
      },
    );

    const firstFunction = result.current.generateForLang;

    rerender({
      method: mockMethod,
      url: mockUrl,
      headers: mockHeaders,
      body: mockBody,
    });

    expect(result.current.generateForLang).toBe(firstFunction);

    rerender({
      method: 'GET',
      url: mockUrl,
      headers: mockHeaders,
      body: mockBody,
    });

    expect(result.current.generateForLang).not.toBe(firstFunction);
  });

  it('should work with different HTTP methods', async () => {
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

    for (const method of methods) {
      const { result } = renderHook(() => useCodegen(method, mockUrl, mockHeaders, mockBody));

      await expect(result.current.generateForLang('curl')).resolves.toBeDefined();
    }
  });

  it('should handle empty headers array', async () => {
    const { result } = renderHook(() => useCodegen(mockMethod, mockUrl, [], mockBody));

    await expect(result.current.generateForLang('curl')).resolves.toBeDefined();
  });

  it('should handle complex JSON bodies', async () => {
    const complexBody = JSON.stringify({
      nested: { object: true },
      array: [1, 2, 3],
      string: 'test',
      number: 42,
      boolean: true,
      null: null,
    });

    vi.mocked(isJson).mockReturnValue(true);

    const { result } = renderHook(() => useCodegen(mockMethod, mockUrl, mockHeaders, complexBody));

    await expect(result.current.generateForLang('curl')).resolves.toBeDefined();
  });
});
