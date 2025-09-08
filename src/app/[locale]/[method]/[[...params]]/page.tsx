import { useAtomValue } from 'jotai';
import { redirect } from 'next/navigation';

import RestClientWrapper from '@/components/client/RestClientWrapper';
import { authAtom } from '@/store';
import { ReadonlyFC } from '@/types';

const ClientPageWrapper: ReadonlyFC = () => {
  const user = useAtomValue(authAtom);

  if (!user) {
    redirect('/login');
  }

  return <RestClientWrapper />;
};

export default ClientPageWrapper;
