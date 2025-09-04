import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ReadonlyFC } from '@/types/readonly.types';

import Providers from './providers';

import '@/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Rest Client App',
  description: 'Interact with APIs, manage requests, and debug effortlessly.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: ReadonlyFC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
