import { QueryClient } from '@tanstack/react-query';
import { vi } from 'vitest';

export function createMockQueryClient(): QueryClient {
  return {
    isFetching: vi.fn(() => 0),
    isMutating: vi.fn(() => 0),
    getQueryData: vi.fn(),
    setQueryData: vi.fn(),
    invalidateQueries: vi.fn(),
    refetchQueries: vi.fn(),
    clear: vi.fn(),
    defaultOptions: {},
  } as unknown as QueryClient;
}
