import { NextResponse } from 'next/server';

export function middleware(req) {
const url = req.nextUrl.clone();
  const host = req.headers.get('host') || '';
  const isLocal =
    host.startsWith('localhost') || host.startsWith('127.0.0.1');

  if (!isLocal) {
    // 1) Ensure HTTPS (use proxy header when deployed)
    const proto = req.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');
    if (proto !== 'https') {
      url.protocol = 'https:';
      return NextResponse.redirect(url, 308);
    }

    // 2) Redirect apex domain to www (only the bare domain)
    if (host === 'aerosportsparks.ca') {
      url.host = 'www.aerosportsparks.ca';
      return NextResponse.redirect(url, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  matcher: ['/admin/:path*', '/locations/:path*', '/'], 
};
