import { QueryClient } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('getQueryClient', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns a new QueryClient on server', async () => {
    vi.doMock('@tanstack/react-query', async () => {
      const actual = await vi.importActual('@tanstack/react-query');
      return {
        ...actual,
        isServer: true,
      };
    });

    const getQueryClient = (await import('@/utils/get-query-client')).default;
    const client1 = getQueryClient();
    const client2 = getQueryClient();

    expect(client1).not.toBe(client2);
    expect(client1).toBeInstanceOf(QueryClient);
  });

  it('returns the same QueryClient in browser', async () => {
    vi.doMock('@tanstack/react-query', async () => {
      const actual = await vi.importActual('@tanstack/react-query');
      return {
        ...actual,
        isServer: false,
      };
    });

    const getQueryClient = (await import('@/utils/get-query-client')).default;
    const client1 = getQueryClient();
    const client2 = getQueryClient();

    expect(client1).toBe(client2);
    expect(client1).toBeInstanceOf(QueryClient);
  });
});
