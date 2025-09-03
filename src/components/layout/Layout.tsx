import React, { FC } from 'react';

import ThemeToggler from '../shared/ThemeToggler';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      {children}
      <ThemeToggler />
    </div>
  );
};

export default Layout;
