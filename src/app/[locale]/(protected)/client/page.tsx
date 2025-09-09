import { redirect } from 'next/navigation';

import { ReadonlyFC } from '@/types';

const ClientIndexPage = (): ReadonlyFC => {
  redirect('./client/GET');
};

export default ClientIndexPage;
