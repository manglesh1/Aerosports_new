import { NextResponse } from 'next/server';

export function middleware(request) {
  const hostname = request.headers.get('host');
  const isLocalhost = hostname?.includes('localhost') || hostname?.includes('127.0.0.1');

  if (!isLocalhost && request.nextUrl.protocol === 'http:') {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next(); // ✅ Correct method
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  matcher: ['/admin/:path*', '/locations/:path*', '/'], 
};
