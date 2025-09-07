import { redirect } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { ReadonlyFC } from '@/types';

interface LogoutProps {
  params: Promise<{ locale: string }>;
}

const Logout: ReadonlyFC<LogoutProps> = async ({ params }) => {
  const { locale } = await params;

  const supabase = await createClient();
  supabase.auth.signOut();

  return redirect({ href: '/login', locale });
};

export default Logout;
