import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n';
import { updateSession } from '@/lib/supabase/middleware';

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest): Promise<NextResponse<unknown>> {
  const response = handleI18nRouting(request);

  const updatedResponse = await updateSession(request, response);

  return updatedResponse;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',

    // Match all pathnames within `{/:locale}/users`
    '/([\\w-]+)?/users/(.+)',
  ],
};
