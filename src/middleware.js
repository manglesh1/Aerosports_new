import { NextResponse } from 'next/server';

// Valid location slugs - must match what's in the Google Sheet "locations" tab
const VALID_LOCATIONS = new Set([
  'oakville',
  'london',
  'windsor',
  'st-catharines',
  'scarborough',
]);

export function middleware(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get('host') || '';
  const isLocal =
    host.startsWith('localhost') || host.startsWith('127.0.0.1');

  if (!isLocal) {
    // 1) Ensure HTTPS (use proxy header when deployed)
    const proto = req.headers.get('x-forwarded-proto') || 'http';
    if (proto !== 'https') {
      return NextResponse.redirect(`https://${host}${url.pathname}${url.search}`, 308);
    }

    // 2) Redirect apex domain to www
    if (host === 'aerosportsparks.ca') {
      return NextResponse.redirect(`https://www.aerosportsparks.ca${url.pathname}${url.search}`, 308);
    }
  }

  // 3) Validate location slug - return 404 for invalid locations
  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length >= 1) {
    const locationSlug = segments[0].toLowerCase();
    // Skip known non-location paths
    const skipPaths = ['admin', 'api', '_next', 'favicon.ico', 'sitemap.xml', 'robots.txt', 'test'];
    if (!skipPaths.includes(locationSlug) && !VALID_LOCATIONS.has(locationSlug)) {
      // Rewrite to the not-found page with 404 status
      url.pathname = '/_not-found';
      return NextResponse.rewrite(url, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/admin/:path*',
    '/locations/:path*',
    '/',
  ],
};
