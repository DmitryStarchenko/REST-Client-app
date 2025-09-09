import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function requireAuth(
  request: NextRequest,
): Promise<{ user: unknown; supabase: ReturnType<typeof createServerClient> }> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: request.cookies,
    },
  );

  const { data: user } = await supabase.auth.getUser();

  if (!user) {
    throw NextResponse.redirect(new URL('/login', request.url));
  }

  return { user, supabase };
}
