import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as base64Module from '@/utils';
import { parseRestPath } from '@/utils';
import * as uidModule from '@/utils';

vi.mock('../src/utils/base64');
vi.mock('../src/utils/uid.ts');

describe('parseRestPath', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('parses method, url and body correctly', () => {
    vi.mocked(base64Module.decodeBase64).mockImplementation((s) => `decoded-${s}`);
    vi.mocked(uidModule.uid).mockReturnValue('uid-123');

    const path = '/client/POST/dXNlcm5hbWU=/Ym9keQ==';
    const result = parseRestPath(path);

    expect(result.method).toBe('POST');
    expect(result.url).toBe('decoded-dXNlcm5hbWU=');
    expect(result.body).toBe('decoded-Ym9keQ==');
    expect(result.headers).toEqual([]);
  });

  it('parses query parameters into headers', () => {
    vi.mocked(uidModule.uid).mockReturnValue('uid-456');

    const path = '/client/GET//?Authorization=Bearer%20token&X-Test=123';
    const result = parseRestPath(path);

    expect(result.method).toBe('GET');
    expect(result.url).toBe('');
    expect(result.body).toBe('');
    expect(result.headers).toEqual([
      { key: 'Authorization', value: 'Bearer token', id: 'uid-456' },
      { key: 'X-Test', value: '123', id: 'uid-456' },
    ]);
  });

  it('returns defaults for empty path', () => {
    const result = parseRestPath('');
    expect(result.method).toBe('GET');
    expect(result.url).toBe('');
    expect(result.body).toBe('');
    expect(result.headers).toEqual([]);
  });
});
