import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import useAutoLogout from '@/hooks/useAutoLogout';
import supabaseClient from '@/lib/supabase/client';

// Mock i18n navigation
vi.mock('@/i18n/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock supabase client
vi.mock('@/lib/supabase/client', () => ({
  default: {
    auth: {
      getSession: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

describe('useAutoLogout', () => {
  const mockPush = vi.fn();
  const mockGetSession = vi.fn();
  const mockSignOut = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    const { useRouter } = await vi.importMock('@/i18n/navigation');
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });

    (supabaseClient.auth.getSession as ReturnType<typeof vi.fn>) = mockGetSession;
    (supabaseClient.auth.signOut as ReturnType<typeof vi.fn>) = mockSignOut;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize without errors', () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useAutoLogout({ isLoggedIn: true }));

    expect(result.current.checkTokenExpiration).toBeInstanceOf(Function);
  });

  it('should not run when user is not logged in', () => {
    const { result } = renderHook(() => useAutoLogout({ isLoggedIn: false }));

    expect(result.current.checkTokenExpiration).toBeInstanceOf(Function);
    // Should not call getSession when not logged in
    expect(mockGetSession).not.toHaveBeenCalled();
  });

  it('should handle session with valid token', async () => {
    const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const mockSession = {
      expires_at: futureTime,
      user: { id: '1' },
    };

    mockGetSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    const { result } = renderHook(() => useAutoLogout({ isLoggedIn: true }));

    await act(async () => {
      await result.current.checkTokenExpiration();
    });

    expect(mockGetSession).toHaveBeenCalled();
    expect(mockSignOut).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should logout when token is expired', async () => {
    const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
    const mockSession = {
      expires_at: pastTime,
      user: { id: '1' },
    };

    mockGetSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    const onLogout = vi.fn();
    const { result } = renderHook(() => useAutoLogout({ onLogout, isLoggedIn: true }));

    await act(async () => {
      await result.current.checkTokenExpiration();
    });

    expect(mockSignOut).toHaveBeenCalled();
    expect(onLogout).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should handle session errors gracefully', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: new Error('Session error'),
    });

    const { result } = renderHook(() => useAutoLogout({ isLoggedIn: true }));

    await act(async () => {
      await result.current.checkTokenExpiration();
    });

    expect(mockSignOut).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should handle missing session gracefully', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useAutoLogout({ isLoggedIn: true }));

    await act(async () => {
      await result.current.checkTokenExpiration();
    });

    expect(mockSignOut).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
