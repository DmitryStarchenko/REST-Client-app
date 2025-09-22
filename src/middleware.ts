import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n';
import { updateSession } from '@/lib';

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest): Promise<NextResponse<unknown>> {
  const response = handleI18nRouting(request);

  const updatedResponse = await updateSession(request, response);

  return updatedResponse;
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)', '/([\\w-]+)?/users/(.+)'],
};
