import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher(['dashboard/(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();

  if (
    !req.nextUrl.pathname.startsWith('/api/webhooks') &&
    !req.nextUrl.pathname.startsWith('/api/stripe/webhook')
  ) {
    return intlMiddleware(req);
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|mp4|MP4|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
};
