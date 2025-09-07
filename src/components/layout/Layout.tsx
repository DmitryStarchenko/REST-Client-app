import React from 'react';

import { ReadonlyFC } from '@/types/readonly.types';

import Footer from './Footer/Footer';
import Header from './Header/Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: ReadonlyFC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
