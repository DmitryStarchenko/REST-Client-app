import { redirect } from 'next/navigation';

import { ReadonlyFC } from '@/types/readonly.types';

// This page only renders when the app is built statically (output: 'export')
const RootPage: ReadonlyFC = () => {
  redirect('/en');
};

export default RootPage;
