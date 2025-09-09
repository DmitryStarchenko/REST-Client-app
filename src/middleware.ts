import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n';
import { requireAuth, updateSession } from '@/lib';
import { isProtectedPath } from '@/utils';

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);

  const updatedResponse = await updateSession(request, response);

  if (isProtectedPath(request.nextUrl.pathname)) {
    try {
      await requireAuth(request);
    } catch (redirectResponse) {
      return redirectResponse as NextResponse;
    }
  }
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
