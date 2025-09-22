import { ReactNode } from 'react';

import { ReadonlyFC } from '@/types/readonly.types';

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout: ReadonlyFC<RootLayoutProps> = ({ children }) => {
  return children;
};

export default RootLayout;
