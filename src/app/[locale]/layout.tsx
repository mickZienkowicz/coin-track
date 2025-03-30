import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { dark } from '@clerk/themes';
import { hasLocale, NextIntlClientProvider } from 'next-intl';

import { routing } from '@/i18n/routing';

import '../globals.css';

import {
  ClerkProvider,
  SignedOut,
  SignInButton,
  SignUpButton
} from '@clerk/nextjs';

import { ErrorMessageWidget } from '@/components/error-message-widget/error-message-widget';
import { Toaster } from '@/components/ui/sonner';
import { pathGenerators } from '@/lib/paths';
import { QueryProvider } from '@/lib/react-query/query-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'CoinTrack App',
  description: ''
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark
      }}
    >
      <html lang='en'>
        <meta name='apple-mobile-web-app-title' content='CoinTrack' />
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NextIntlClientProvider>
            <Toaster position='top-right' richColors />
            <ErrorMessageWidget />
            <SignedOut>
              <header className='flex h-16 items-center justify-end gap-4 p-4'>
                <SignInButton
                  fallbackRedirectUrl={pathGenerators.dashboard()}
                  signUpFallbackRedirectUrl={pathGenerators.dashboard()}
                />
                <SignUpButton
                  fallbackRedirectUrl={pathGenerators.dashboard()}
                />
              </header>
            </SignedOut>
            <QueryProvider>
              <div className='mx-auto flex h-screen w-full max-w-screen-3xl flex-col items-center justify-center'>
                {children}
              </div>
            </QueryProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
