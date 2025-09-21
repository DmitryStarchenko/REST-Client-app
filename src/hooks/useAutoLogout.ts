'use client';

import { useCallback, useEffect, useRef } from 'react';

import { useRouter } from '@/i18n/navigation';
import supabaseClient from '@/lib/supabase/client';

interface UseAutoLogoutOptions {
  onLogout?: () => void;
  checkInterval?: number;
  isLoggedIn?: boolean;
}

interface UseAutoLogoutReturn {
  checkTokenExpiration: () => Promise<void>;
}

const useAutoLogout = (options: UseAutoLogoutOptions = {}): UseAutoLogoutReturn => {
  const { onLogout, checkInterval = 60000, isLoggedIn = true } = options;
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkTokenExpiration = useCallback(async () => {
    if (!isLoggedIn) {
      return;
    }

    try {
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession();

      if (error || !session?.expires_at) {
        return;
      }

      const expirationTime = session.expires_at * 1000;
      const currentTime = Date.now();

      if (currentTime >= expirationTime) {
        await supabaseClient.auth.signOut();

        if (onLogout) {
          onLogout();
        }

        router.push('/login');
      }
    } catch {}
  }, [onLogout, router, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    checkTokenExpiration();

    intervalRef.current = setInterval(checkTokenExpiration, checkInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkInterval, onLogout, router, checkTokenExpiration, isLoggedIn]);

  return {
    checkTokenExpiration,
  };
};

export default useAutoLogout;
