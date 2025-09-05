import type { Metadata } from 'next';
import '@/styles/globals.css';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';

import Layout from '@/components/layout/Layout';
import { routing } from '@/i18n/routing';
import { ReadonlyFC } from '@/types/readonly.types';

import Providers from './providers';

export const metadata: Metadata = {
  title: 'PUTMAN',
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
      <body>
        <div id="root">
          <NextIntlClientProvider locale={locale}>
            <Providers>
              <Layout>{children}</Layout>
            </Providers>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
