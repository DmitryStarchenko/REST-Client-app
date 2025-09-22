import { describe, it, vi, expect } from 'vitest';

import { uid } from '@/utils';

describe('uid', () => {
  it('calls crypto.randomUUID and returns a string', () => {
    const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(mockUUID);

    const result = uid();

    expect(globalThis.crypto.randomUUID).toHaveBeenCalled();
    expect(result).toBe(mockUUID);

    vi.restoreAllMocks();
  });
});
