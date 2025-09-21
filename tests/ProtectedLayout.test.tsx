import { ReactNode } from 'react';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import ProtectedLayout from '@/app/[locale]/(protected)/layout';
import { redirect } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/i18n/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('ProtectedLayout', () => {
  const mockRedirect = vi.mocked(redirect);
  const mockCreateClient = vi.mocked(createClient);
  const mockSupabase = {
    auth: {
      getClaims: vi.fn(),
    },
  };

  const mockChildren: ReactNode = <div>Test Children</div>;
  const mockParams = Promise.resolve({ locale: 'en' });

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateClient.mockResolvedValue(mockSupabase as never);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should redirect to login when there is an error getting claims', async () => {
    const error = new Error('Auth error');
    mockSupabase.auth.getClaims.mockResolvedValueOnce({
      data: null,
      error,
    } as never);
    try {
      await ProtectedLayout({ children: mockChildren, params: mockParams });
    } catch {}

    expect(mockCreateClient).toHaveBeenCalled();
    expect(mockSupabase.auth.getClaims).toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith({
      href: '/login',
      locale: 'en',
    });
  });

  it('should redirect to login when claims are null', async () => {
    mockSupabase.auth.getClaims.mockResolvedValueOnce({
      data: { claims: null },
      error: null,
    } as never);
    try {
      await ProtectedLayout({ children: mockChildren, params: mockParams });
    } catch {}

    expect(mockCreateClient).toHaveBeenCalled();
    expect(mockSupabase.auth.getClaims).toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith({
      href: '/login',
      locale: 'en',
    });
  });

  it('should redirect to login when claims are undefined', async () => {
    mockSupabase.auth.getClaims.mockResolvedValueOnce({
      data: { claims: undefined },
      error: null,
    } as never);

    try {
      await ProtectedLayout({ children: mockChildren, params: mockParams });
    } catch {}

    expect(mockCreateClient).toHaveBeenCalled();
    expect(mockSupabase.auth.getClaims).toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith({
      href: '/login',
      locale: 'en',
    });
  });

  it('should render children when claims are present', async () => {
    const mockClaims = { sub: 'user-id', email: 'test@example.com' };
    mockSupabase.auth.getClaims.mockResolvedValueOnce({
      data: { claims: mockClaims },
      error: null,
    } as never);
    const result = await ProtectedLayout({
      children: mockChildren,
      params: mockParams,
    });
    expect(mockCreateClient).toHaveBeenCalled();
    expect(mockSupabase.auth.getClaims).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
    expect(result).toEqual(mockChildren);
  });

  it('should use correct locale from params', async () => {
    const spanishParams = Promise.resolve({ locale: 'es' });
    mockSupabase.auth.getClaims.mockResolvedValueOnce({
      data: { claims: null },
      error: null,
    } as never);

    try {
      await ProtectedLayout({ children: mockChildren, params: spanishParams });
    } catch {}

    expect(mockRedirect).toHaveBeenCalledWith({
      href: '/login',
      locale: 'es',
    });
  });
});
