import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ReadonlyFC } from '@/types/readonly.types';

import Providers from './providers';

import '@/styles/globals.css';
import { hasLocale, NextIntlClientProvider } from 'next-intl';

import { routing } from '@/i18n/routing';

import { notFound } from 'next/navigation';

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
  params: Promise<{ locale: string }>;
}

const RootLayout: ReadonlyFC<RootLayoutProps> = async ({ children, params }) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextIntlClientProvider locale={locale}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
