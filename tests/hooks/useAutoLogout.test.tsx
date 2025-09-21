import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Mock } from 'vitest';

import useAutoLogout from '@/hooks/useAutoLogout';
import { useRouter } from '@/i18n/navigation';
import supabaseClient from '@/lib/supabase/client';

type MockSession = {
  data: {
    session: {
      expires_at?: number;
    } | null;
  };
  error: Error | null;
};

type MockRouter = {
  push: Mock;
  replace: Mock;
  prefetch: Mock;
  back: Mock;
  forward: Mock;
  refresh: Mock;
};

vi.mock('@/lib/supabase/client', () => ({
  default: {
    auth: {
      getSession: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

vi.mock('@/i18n/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  })),
}));

describe('useAutoLogout', () => {
  const mockPush = vi.fn();
  const mockSignOut = vi.fn();
  const mockGetSession = vi.fn();
  const mockOnLogout = vi.fn();

  const mockRouter: MockRouter = {
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useRouter).mockReturnValue(mockRouter);

    vi.mocked(supabaseClient.auth.getSession).mockImplementation(mockGetSession);
    vi.mocked(supabaseClient.auth.signOut).mockImplementation(mockSignOut);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not check expiration when user is not logged in', async () => {
    const { result } = renderHook(() => useAutoLogout({ isLoggedIn: false }));

    await act(async () => {
      await result.current.checkTokenExpiration();
    });

    expect(mockGetSession).not.toHaveBeenCalled();
  });

  it('should not logout when token is still valid', async () => {
    const futureTime = Math.floor((Date.now() + 3600000) / 1000);
    const mockSession: MockSession = {
      data: { session: { expires_at: futureTime } },
      error: null,
    };

    mockGetSession.mockResolvedValue(mockSession);

    const { result } = renderHook(() => useAutoLogout());

    await act(async () => {
      await result.current.checkTokenExpiration();
    });

    expect(mockSignOut).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should logout when token is expired', async () => {
    const pastTime = Math.floor((Date.now() - 3600000) / 1000);
    const mockSession: MockSession = {
      data: { session: { expires_at: pastTime } },
      error: null,
    };

    mockGetSession.mockResolvedValue(mockSession);

    const { result } = renderHook(() => useAutoLogout());

    await act(async () => {
      await result.current.checkTokenExpiration();
    });

    expect(mockSignOut).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should call onLogout callback when provided', async () => {
    const pastTime = Math.floor((Date.now() - 3600000) / 1000);
    const mockSession: MockSession = {
      data: { session: { expires_at: pastTime } },
      error: null,
    };

    mockGetSession.mockResolvedValue(mockSession);

    const { result } = renderHook(() => useAutoLogout({ onLogout: mockOnLogout }));

    await act(async () => {
      await result.current.checkTokenExpiration();
    });

    expect(mockOnLogout).toHaveBeenCalled();
  });

  it('should handle session error gracefully', async () => {
    const mockSession: MockSession = {
      data: { session: null },
      error: new Error('Session error'),
    };

    mockGetSession.mockResolvedValue(mockSession);

    const { result } = renderHook(() => useAutoLogout());

    await act(async () => {
      await result.current.checkTokenExpiration();
    });

    expect(mockSignOut).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should handle missing expires_at field', async () => {
    const mockSession: MockSession = {
      data: { session: { expires_at: undefined } },
      error: null,
    };

    mockGetSession.mockResolvedValue(mockSession);

    const { result } = renderHook(() => useAutoLogout());

    await act(async () => {
      await result.current.checkTokenExpiration();
    });

    expect(mockSignOut).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should set up interval for checking expiration', async () => {
    const futureTime = Math.floor((Date.now() + 3600000) / 1000);
    const mockSession: MockSession = {
      data: { session: { expires_at: futureTime } },
      error: null,
    };

    mockGetSession.mockResolvedValue(mockSession);

    renderHook(() => useAutoLogout({ checkInterval: 5000 }));

    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    expect(mockGetSession).toHaveBeenCalledTimes(3);
  });

  it('should clear interval on unmount', async () => {
    const futureTime = Math.floor((Date.now() + 3600000) / 1000);
    const mockSession: MockSession = {
      data: { session: { expires_at: futureTime } },
      error: null,
    };

    mockGetSession.mockResolvedValue(mockSession);

    const { unmount } = renderHook(() => useAutoLogout());

    await act(async () => {
      vi.advanceTimersByTime(60000);
    });

    unmount();

    await act(async () => {
      vi.advanceTimersByTime(60000);
    });

    expect(mockGetSession).toHaveBeenCalledTimes(2);
  });

  it('should return checkTokenExpiration function', async () => {
    const futureTime = Math.floor((Date.now() + 3600000) / 1000);
    const mockSession: MockSession = {
      data: { session: { expires_at: futureTime } },
      error: null,
    };

    mockGetSession.mockResolvedValue(mockSession);

    const { result } = renderHook(() => useAutoLogout());

    expect(typeof result.current.checkTokenExpiration).toBe('function');

    await act(async () => {
      await result.current.checkTokenExpiration();
    });

    expect(mockGetSession).toHaveBeenCalled();
  });
});
