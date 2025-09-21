import { ReactNode } from 'react';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { redirect } from '@/i18n/navigation';

vi.mock('@/i18n/navigation', () => ({
  redirect: vi.fn(),
}));

const mockGetClaims = vi.fn();
const mockAuth = {
  getClaims: mockGetClaims,
};

const mockSupabaseClient = {
  auth: mockAuth,
};

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));

describe('AuthLayout', () => {
  const mockRedirect = vi.mocked(redirect);

  const mockChildren: ReactNode = <div>Test Children</div>;
  const mockParams = Promise.resolve({ locale: 'en' });

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetClaims.mockReset();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should redirect to home page when user has claims', async () => {
    mockGetClaims.mockResolvedValue({
      data: { claims: { sub: 'user-id' } },
      error: null,
    });
    const AuthLayoutModule = await import('../src/app/[locale]/(auth)/layout');
    const AuthLayout = AuthLayoutModule.default;
    const result = await AuthLayout({ children: mockChildren, params: mockParams });
    expect(mockGetClaims).toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith({ href: '/', locale: 'en' });
    expect(result).toBeUndefined();
  });

  it('should return children when user has no claims', async () => {
    mockGetClaims.mockResolvedValue({
      data: { claims: null },
      error: null,
    });
    const AuthLayoutModule = await import('../src/app/[locale]/(auth)/layout');
    const AuthLayout = AuthLayoutModule.default;
    const result = await AuthLayout({ children: mockChildren, params: mockParams });
    expect(mockGetClaims).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
    expect(result).toBe(mockChildren);
  });

  it('should return children when getClaims returns error', async () => {
    mockGetClaims.mockResolvedValue({
      data: null,
      error: new Error('Auth error'),
    });
    const AuthLayoutModule = await import('../src/app/[locale]/(auth)/layout');
    const AuthLayout = AuthLayoutModule.default;
    const result = await AuthLayout({ children: mockChildren, params: mockParams });
    expect(mockGetClaims).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
    expect(result).toBe(mockChildren);
  });

  it('should handle empty data object gracefully', async () => {
    mockGetClaims.mockResolvedValue({
      data: {},
      error: null,
    });
    const AuthLayoutModule = await import('../src/app/[locale]/(auth)/layout');
    const AuthLayout = AuthLayoutModule.default;
    const result = await AuthLayout({ children: mockChildren, params: mockParams });
    expect(mockGetClaims).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
    expect(result).toBe(mockChildren);
  });

  it('should use correct locale from params', async () => {
    const spanishParams = Promise.resolve({ locale: 'es' });
    mockGetClaims.mockResolvedValue({
      data: { claims: { sub: 'user-id' } },
      error: null,
    });
    const AuthLayoutModule = await import('../src/app/[locale]/(auth)/layout');
    const AuthLayout = AuthLayoutModule.default;
    await AuthLayout({ children: mockChildren, params: spanishParams });
    expect(mockRedirect).toHaveBeenCalledWith({ href: '/', locale: 'es' });
  });
});
