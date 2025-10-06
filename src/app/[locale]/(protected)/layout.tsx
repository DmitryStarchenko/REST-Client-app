import { ReactNode } from 'react';

import { redirect } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { ReadonlyFC } from '@/types/readonly.types';

type RootLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const ProtectedLayout: ReadonlyFC<RootLayoutProps> = async ({ children, params }) => {
  const { locale } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect({ href: '/login', locale });
  }

  return children;
};

export default ProtectedLayout;
