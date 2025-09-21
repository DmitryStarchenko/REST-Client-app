import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import { redirect } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';

import Logout from '../src/app/[locale]/(auth)/logout/page';

vi.mock('@/i18n/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('Logout', () => {
  const mockSignOut = vi.fn();
  const mockAuth = {
    signOut: mockSignOut,
  };
  const mockSupabase = {
    auth: mockAuth,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as Mock).mockResolvedValue(mockSupabase);
  });

  it('should call supabase.auth.signOut and redirect to login page', async () => {
    const mockParams = Promise.resolve({ locale: 'en' });
    await Logout({ params: mockParams });
    expect(createClient).toHaveBeenCalled();
    expect(mockSignOut).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith({
      href: '/login',
      locale: 'en',
    });
  });

  it('should handle different locales correctly', async () => {
    const mockParams = Promise.resolve({ locale: 'ru' });
    await Logout({ params: mockParams });
    expect(redirect).toHaveBeenCalledWith({
      href: '/login',
      locale: 'ru',
    });
  });

  it('should await params resolution before proceeding', async () => {
    let resolveParams: (value: { locale: string }) => void;
    const mockParams = new Promise<{ locale: string }>((resolve) => {
      resolveParams = resolve;
    });

    const logoutPromise = Logout({ params: mockParams });
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(redirect).not.toHaveBeenCalled();
    resolveParams!({ locale: 'en' });
    await logoutPromise;
    expect(redirect).toHaveBeenCalledWith({
      href: '/login',
      locale: 'en',
    });
  });
});
