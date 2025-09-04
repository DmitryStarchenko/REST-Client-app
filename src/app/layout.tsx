import type { Metadata } from 'next';
import '@/styles/globals.css';
import { FC, ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'PUTMAN',
  description: 'Interact with APIs, manage requests, and debug effortlessly.',
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
