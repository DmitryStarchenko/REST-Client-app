import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { locales } from '@/i18n/routing';

const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function updateSession(request: NextRequest, response: NextResponse) {
  // If the env vars are not set, skip middleware check. You can remove this
  // once you setup the project.
  if (!hasEnvVars) {
    return response;
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  return response;
}
