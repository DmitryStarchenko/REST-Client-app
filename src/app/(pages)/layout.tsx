import { FC, ReactNode } from 'react';

import Footer from '../../widgets/footer/footer';
import Header from '../../widgets/header/header';

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default PageLayout;
