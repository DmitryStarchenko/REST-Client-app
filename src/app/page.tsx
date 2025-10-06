import { redirect } from 'next/navigation';

import { ReadonlyFC } from '@/types/readonly.types';

const RootPage: ReadonlyFC = () => {
  redirect('/en');
};

export default RootPage;
