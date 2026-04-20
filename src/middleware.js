import { NextResponse } from 'next/server';

// Valid location slugs - must match what's in the Google Sheet "locations" tab
const VALID_LOCATIONS = new Set([
  'oakville',
  'london',
  'windsor',
  'st-catharines',
  'scarborough',
]);

// Legacy / redirect-only path prefixes — let Next.js redirects (next.config.mjs) handle these
// Keep in sync with the "redirects" tab in the Google Sheet
const REDIRECT_PREFIXES = new Set([
  'brampton',
  'thunderbay',
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
    const skipPaths = ['admin', 'api', '_next', 'assets', 'invitations', 'favicon.ico', 'sitemap.xml', 'robots.txt', 'test', 'llms.txt', 'about-us', 'contact-us', 'privacy-policy', 'attractions', 'school-groups', 'summer-camps', 'team-celebrations', 'corporate-events'];

    // Allow redirect prefixes through — next.config.mjs redirects will handle them
    if (REDIRECT_PREFIXES.has(locationSlug)) {
      return NextResponse.next();
    }

    if (
      VALID_LOCATIONS.has(locationSlug) &&
      segments.length === 2 &&
      ['contactus', 'contact-us'].includes(segments[1].toLowerCase())
    ) {
      url.pathname = `/${locationSlug}/about-us/contact-us`;
      return NextResponse.redirect(url, 308);
    }

    if (!skipPaths.includes(locationSlug) && !VALID_LOCATIONS.has(locationSlug)) {
      return new NextResponse(
        `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex, nofollow" />
    <title>404 | AeroSports Parks</title>
  </head>
  <body>
    <main>
      <h1>404</h1>
      <p>Sorry, we couldn't find that page.</p>
      <p><a href="/">Return to Home</a></p>
    </main>
  </body>
</html>`,
        {
          status: 404,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Robots-Tag': 'noindex, nofollow',
          },
        }
      );
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
