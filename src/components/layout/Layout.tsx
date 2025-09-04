import React from 'react';

import { ReadonlyFC } from '@/types/readonly.types';

import ThemeToggler from '../shared/ThemeToggler';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: ReadonlyFC<LayoutProps> = ({ children }) => {
  return (
    <div>
      {children}
      <ThemeToggler />
    </div>
  );
};

export default Layout;
