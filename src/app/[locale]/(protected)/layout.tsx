import { ReactNode } from 'react';

import { redirect } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { ReadonlyFC } from '@/types/readonly.types';

type RootLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
const RootLayout: ReadonlyFC<RootLayoutProps> = async ({ children, params }) => {
  const { locale } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect({ href: '/login', locale });
  }

  return children;
};

export default RootLayout;
