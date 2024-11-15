import { NextResponse } from 'next/server';
import NodeCache from 'node-cache';

// Initialize a cache with TTL of 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300 });

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Skip caching for static assets and API routes
  if (pathname.startsWith('/_next/') || pathname.startsWith('/api/') || pathname.indexOf('contactus')>0) {
    return NextResponse.next();
  }

  // Use pathname as the cache key to avoid query parameter mismatches
  const cachedData = cache.get(pathname);
  if (cachedData) {
    console.log(`Serving cached response for ${pathname}`);
    const response = NextResponse.next();

    // Apply cached headers to the response
    for (const [key, value] of Object.entries(cachedData.headers)) {
      response.headers.set(key, value);
    }

    return response;
  }

  // Generate a new response if not cached
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=300');

  // Cache only headers since middleware can't cache full body content
  const headers = {};
  for (const [key, value] of response.headers.entries()) {
    headers[key] = value;
  }
  cache.set(pathname, { headers });

  console.log(`Caching response headers for ${pathname}`);
  return response;
}

export const config = {
  matcher: ['/:weee*'], // Applies middleware to all routes
};
