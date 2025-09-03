import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'PUTMAN',
  description: 'Interact with APIs, manage requests, and debug effortlessly.',
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>): ReactNode => {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
