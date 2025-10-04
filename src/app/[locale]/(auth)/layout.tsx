import { ReactNode } from 'react';

import { redirect } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { ReadonlyFC } from '@/types/readonly.types';

type AuthLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const AuthLayout: ReadonlyFC<AuthLayoutProps> = async ({ children, params }) => {
  const { locale } = await params;

  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    return redirect({ href: '/', locale });
  }

  return children;
};

export default AuthLayout;
