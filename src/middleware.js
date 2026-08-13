import { NextResponse } from 'next/server';

// Location slugs served by THIS codebase — the Main project (corporate + Windsor + St. Catharines).
// Oakville / London / Scarborough live in the separate Group3 codebase and are routed there by the
// Cloudflare Worker before requests reach this app. See docs/two-codebase-architecture.md.
const VALID_LOCATIONS = new Set([
  'windsor',
  'st-catharines',
]);

// Legacy / redirect-only path prefixes — let Next.js redirects (next.config.mjs) handle these
// Keep in sync with the "redirects" tab in the Google Sheet
const REDIRECT_PREFIXES = new Set([
  'thunderbay',
]);

// Cities served by the separate Group3 codebase (Oakville / London / Scarborough).
const GROUP3_LOCATIONS = new Set([
  'oakville',
  'london',
  'scarborough',
]);

// Reversed malformed URLs discovered in GSC append a real top-level section
// slug as the final segment, e.g. /{location}/{child}/blogs. Those should be
// hard 404s instead of soft-404 app responses.
const HARD_404_TRAILING_SECTION_SLUGS = new Set([
  'about-us',
  'attractions',
  'blogs',
  'group-events',
  'groups',
  'groups-events',
  'pricing-promos',
  'programs',
]);

function renderHard404() {
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

// Proxy the Group3 cities to the Group3 app when GROUP3_ORIGIN is set — e.g.
// http://localhost:3005 locally, or the Group3 deploy URL for the prototype. This makes Main a
// reverse proxy for those paths (one origin, flat URLs, no Cloudflare/DNS work) — fine for
// prototyping. At production scale, move this routing to the Cloudflare Worker and leave
// GROUP3_ORIGIN unset here so Main is no longer in the path. See docs/two-codebase-architecture.md.
const GROUP3_ORIGIN = process.env.GROUP3_ORIGIN;

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
    const skipPaths = ['admin', 'studio', 'api', '_next', 'assets', 'invitations', 'favicon.ico', 'sitemap.xml', 'robots.txt', 'test', 'llms.txt', 'about-us', 'contact-us', 'privacy-policy', 'attractions', 'school-groups', 'summer-camps', 'team-celebrations', 'corporate-events', 'blogs', 'audits'];

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

    if (
      VALID_LOCATIONS.has(locationSlug) &&
      segments.length === 2 &&
      segments[1].toLowerCase() === 'camps'
    ) {
      url.pathname = `/${locationSlug}/programs/camps`;
      return NextResponse.redirect(url, 308);
    }

    if (
      (VALID_LOCATIONS.has(locationSlug) || GROUP3_LOCATIONS.has(locationSlug)) &&
      segments.length === 3
    ) {
      const middleSlug = segments[1].toLowerCase();
      const trailingSlug = segments[2].toLowerCase();
      if (
        HARD_404_TRAILING_SECTION_SLUGS.has(trailingSlug) &&
        middleSlug !== trailingSlug
      ) {
        return renderHard404();
      }
    }

    // LOCAL DEV: forward the Group3 cities to the Group3 dev server instead of 404-ing.
    // No-op in production (GROUP3_ORIGIN unset) — Cloudflare routes these paths there.
    if (GROUP3_ORIGIN && GROUP3_LOCATIONS.has(locationSlug)) {
      return NextResponse.rewrite(new URL(`${url.pathname}${url.search}`, GROUP3_ORIGIN));
    }

    // Group2 cities (oakville/london/scarborough) are served by THIS service via the
    // location-groups system (group2). Treat them as valid so they render instead of 404-ing.
    if (
      !skipPaths.includes(locationSlug) &&
      !VALID_LOCATIONS.has(locationSlug) &&
      !GROUP3_LOCATIONS.has(locationSlug)
    ) {
      return renderHard404();
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
