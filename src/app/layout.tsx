import { ReactNode } from 'react';

import { ReadonlyFC } from '@/types/readonly.types';

type RootLayoutProps = {
  children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
const RootLayout: ReadonlyFC<RootLayoutProps> = ({ children }) => {
  return children;
};

export default RootLayout;
