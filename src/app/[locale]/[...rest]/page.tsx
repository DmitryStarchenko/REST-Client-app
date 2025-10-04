import { notFound } from 'next/navigation';

import { ReadonlyFC } from '@/types/readonly.types';

const CatchAllPage: ReadonlyFC = () => {
  notFound();
};

export default CatchAllPage;
