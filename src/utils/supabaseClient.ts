'use client';

import type { Session } from '@supabase/supabase-js';

import supabaseClient from '@/lib/supabase/client';

export async function getValidatedSession(): Promise<Session | null> {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  return session ?? null;
}
