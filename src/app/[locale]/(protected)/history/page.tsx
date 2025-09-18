import { FC, Suspense } from 'react';

import LayoutHistory from '@/components/layout/History/History';
import Loader from '@/components/shared/Loader/Loader';

const History: FC = () => {
  return (
    <Suspense fallback={<Loader />}>
      <LayoutHistory />
    </Suspense>
  );
};

export default History;
