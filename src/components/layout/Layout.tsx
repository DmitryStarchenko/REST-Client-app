import React from 'react';

import { ReadonlyFC } from '@/types/readonly.types';

import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: ReadonlyFC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  );
};

export default Layout;
