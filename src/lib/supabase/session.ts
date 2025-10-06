import type { Session } from '@supabase/supabase-js';

export async function getValidatedServerSession(): Promise<Session | null> {
  const { createClient } = await import('./server');
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return null;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session ?? null;
}

export async function getValidatedClientSession(): Promise<Session | null> {
  const { default: supabaseClient } = await import('./client');

  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();
  if (userError || !user) return null;

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  return session ?? null;
}
