import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { vi } from 'vitest';

export function createMockQueryClient(): QueryClient {
  return {
    mount: vi.fn(),
    unmount: vi.fn(),
    isFetching: vi.fn(() => 0),
    isMutating: vi.fn(() => 0),
    getQueryData: vi.fn(),
    getQueryState: vi.fn(),
    getQueriesData: vi.fn(),
    setQueryData: vi.fn(),
    setQueriesData: vi.fn(),
    invalidateQueries: vi.fn(),
    refetchQueries: vi.fn(),
    cancelQueries: vi.fn(),
    removeQueries: vi.fn(),
    resetQueries: vi.fn(),
    fetchQuery: vi.fn(),
    prefetchQuery: vi.fn(),
    fetchInfiniteQuery: vi.fn(),
    prefetchInfiniteQuery: vi.fn(),
    ensureQueryData: vi.fn(),
    executeMutation: vi.fn(),
    getDefaultOptions: vi.fn(),
    setDefaultOptions: vi.fn(),
    getQueryDefaults: vi.fn(),
    setQueryDefaults: vi.fn(),
    getMutationDefaults: vi.fn(),
    setMutationDefaults: vi.fn(),
    clear: vi.fn(),
    resumePausedMutations: vi.fn(),
    getLogger: vi.fn(),
    queryCache: new QueryCache(),
    mutationCache: new MutationCache(),
    defaultOptions: {},
  } as unknown as QueryClient;
}
