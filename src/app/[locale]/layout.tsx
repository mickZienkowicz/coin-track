import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { dark } from '@clerk/themes';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';

import { routing } from '@/i18n/routing';

import '../globals.css';

import { ClerkProvider } from '@clerk/nextjs';

import { ErrorMessageWidget } from '@/components/error-message-widget/error-message-widget';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/lib/react-query/query-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: '%s | CoinTrack',
      default: 'CoinTrack'
    },
    description: 'Your app description',
    icons: {
      icon: [{ url: '/favicon.ico' }, { url: '/icon.png', type: 'image/png' }],
      apple: [{ url: '/apple-icon.png', type: 'image/png' }]
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'CoinTrack'
    },
    formatDetection: {
      telephone: false
    },
    other: {
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'CoinTrack'
    }
  };
}

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
      <html lang={locale}>
        <meta name='theme-color' content='#0a0a0a' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=2, user-scalable=no'
        />
        <link rel='apple-touch-icon' href='/web-app-manifest-192x192.png' />
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NextIntlClientProvider>
            <Toaster position='top-right' richColors />
            <ErrorMessageWidget />
            <QueryProvider>
              <div className='mx-auto flex min-h-screen w-full max-w-screen-3xl flex-col items-center justify-center'>
                {children}
              </div>
            </QueryProvider>
          </NextIntlClientProvider>
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
