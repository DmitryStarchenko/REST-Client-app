import { ReactNode } from 'react';

import Footer from '../../widgets/footer/footer';
import Header from '../../widgets/header/header';

const PageLayout = ({ children }: { children: ReactNode }): ReactNode => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default PageLayout;
