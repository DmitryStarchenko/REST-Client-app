import React from 'react';

import { ReadonlyFC } from '@/types/readonly.types';

import Footer from './Footer/Footer';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: ReadonlyFC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
