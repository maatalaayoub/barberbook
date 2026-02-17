import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Supported locales
const locales = ['en', 'fr', 'ar'];
const defaultLocale = 'en';

// Define route matchers for different sections
const isUserRoute = createRouteMatcher(['/user/:path*', '/:locale/user/:path*']);
const isBarberRoute = createRouteMatcher(['/barber/:path*', '/:locale/barber/:path*']);
const isUserAuthRoute = createRouteMatcher(['/auth/user/:path*', '/:locale/auth/user/:path*']);
const isBarberAuthRoute = createRouteMatcher(['/auth/barber/:path*', '/:locale/auth/barber/:path*']);

// Helper to get locale from pathname
function getLocaleFromPath(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && locales.includes(segments[0])) {
    return segments[0];
  }
  return null;
}

// Helper to get locale from request
function getPreferredLocale(request) {
  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().substring(0, 2))
      .find((lang) => locales.includes(lang));
    if (preferredLocale) return preferredLocale;
  }
  return defaultLocale;
}

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  const searchParams = req.nextUrl.searchParams;
  
  // Check for setup flag (allows passing role setup parameter)
  const setupRole = searchParams.get('setup');
  
  // Skip static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Handle locale routing first
  const pathnameLocale = getLocaleFromPath(pathname);
  const hasLocale = pathnameLocale !== null;
  
  // If no locale in path, redirect with locale prefix
  if (!hasLocale && !pathname.startsWith('/api')) {
    const locale = getPreferredLocale(req);
    const newUrl = new URL(`/${locale}${pathname}`, req.url);
    // Preserve search params
    newUrl.search = req.nextUrl.search;
    return NextResponse.redirect(newUrl);
  }

  const locale = pathnameLocale || defaultLocale;
  
  // Get auth state (only check if user is signed in)
  const { userId } = await auth();

  // Check if accessing auth routes
  if (isUserAuthRoute(req) || isBarberAuthRoute(req)) {
    if (userId) {
      // Already signed in - redirect appropriately
      // Role check will be done on the destination page
      if (isBarberAuthRoute(req)) {
        return NextResponse.redirect(new URL(`/${locale}/barber/dashboard`, req.url));
      }
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }
    // Allow access to auth pages for non-authenticated users
    return NextResponse.next();
  }

  // User routes - redirect to home (users don't have dashboard)
  if (isUserRoute(req)) {
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  // Barber routes - require authentication only
  // Role verification is done on the page level via useRole hook
  if (isBarberRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL(`/${locale}/auth/barber/sign-in`, req.url));
    }
    // Allow access - role check done client-side in dashboard
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

