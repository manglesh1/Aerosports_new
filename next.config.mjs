// next.config.mjs
/** @type {import('next').NextConfig} */
import * as XLSX from 'xlsx';

// 1) Put this in .env.local (and in your CI/CD env):
// REDIRECT_SHEET_XLSX="https://docs.google.com/spreadsheets/d/XXX/export?format=xlsx"
const SHEET_URL = process.env.REDIRECT_SHEET_XLSX
  ?? 'https://docs.google.com/spreadsheets/d/1B_9EaTQDztWGH_cD3lUP7hpWD6FvNBJ-6Czml2x7d9c/export?format=xlsx';
const ASSET_ORIGIN = (process.env.NEXT_ASSET_ORIGIN || '').replace(/\/$/, '');
const ASSET_PATH_PREFIX = (process.env.NEXT_ASSET_PATH_PREFIX || '').replace(/\/$/, '');

function normalizeLegacyWildcardRedirect(source, destination) {
  const splatParams = [];
  let splatIndex = 0;

  const normalizedSource = source.replace(/\/\*(?=\/|$)/g, () => {
    const param = `:splat${splatIndex++}*`;
    splatParams.push(param);
    return `/${param}`;
  });

  let destinationSplatIndex = 0;
  const normalizedDestination = destination.replace(/\/\*(?=\/|$)/g, () => {
    const param = splatParams[destinationSplatIndex++] || splatParams[splatParams.length - 1];
    return param ? `/${param}` : '';
  });

  return { source: normalizedSource, destination: normalizedDestination };
}

async function fetchSheetRedirects() {
  try {
    const res = await fetch(SHEET_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status} ${res.statusText}`);

    // Parse XLSX
    const buf = Buffer.from(await res.arrayBuffer());
    const wb = XLSX.read(buf, { type: 'buffer' });

    // Prefer a sheet named "redirects", else first sheet
    const ws = wb.Sheets['redirects'] ?? wb.Sheets[wb.SheetNames[0]];
    if (!ws) return [];

    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
//console.log('Redirects rows:', rows);
    const out = [];
    for (const r of rows) {
      // Be forgiving about column casing/names
      let source = String(r.source ?? '').trim();
      let destination = String(r.destination ?? '').trim();
      const raw = String(
        r.permanent?? r.code ?? r.Code ?? ''
      ).trim().toLowerCase();

      if (!source || !destination) continue;
      ({ source, destination } = normalizeLegacyWildcardRedirect(source, destination));

      // permanent: true for 301 (or empty), false for 302
      const permanent =
        raw === '' || raw === '301' || raw === 'true' || raw === 'permanent' ||
        raw === '1' || raw === 'yes';

      out.push({ source, destination, permanent });
    }
    
    return out;
  } catch (e) {
    console.warn('[redirects] Failed to load sheet:', e.message);
    return [];
  }
}

const nextConfig = {
  // When a service is mounted under the public domain by Cloudflare path rules,
  // its Next build assets still live at /_next/* on that service. Point JS/CSS/font
  // chunks to the service origin so they don't 404 against the default app.
  assetPrefix: ASSET_ORIGIN || ASSET_PATH_PREFIX || undefined,
  crossOrigin: ASSET_ORIGIN ? 'anonymous' : undefined,

  // Cache headers — Cloudflare respects these to cache at edge
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
      {
        source: '/studio/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
      {
        source: '/test/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
      {
        source: '/audits/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
      {
        // HTML pages: cache at the edge for the same daily rhythm as sheet data.
        // Browsers always revalidate (max-age=0) so users never see truly stale content.
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // Next.js static assets — immutable, cache forever (they have hashed filenames)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value:
              process.env.NODE_ENV === 'production'
                ? 'public, max-age=31536000, immutable'
                : 'no-store, must-revalidate',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
        ],
      },
    ];
  },

  async redirects() {
    const sheetRedirects = await fetchSheetRedirects();
// console.log('Fetched redirects:', sheetRedirects);

    // (Optional) Keep a few hardcoded fallbacks here if you want
    // const staticRedirects = [ ... ];
    // return [...staticRedirects, ...sheetRedirects];

    return sheetRedirects;
  },

  // Allow Next image optimization for approved remote media hosts.
  // Note: this only affects images rendered through next/image.
  images: {
    // Production path routing does not reliably serve /_next/image optimizer
    // responses, while our media is already CDN-hosted WebP. Serve image
    // sources directly so production matches the working CDN URLs.
    unoptimized: true,
    path: ASSET_ORIGIN
      ? `${ASSET_ORIGIN}/_next/image`
      : ASSET_PATH_PREFIX
        ? `${ASSET_PATH_PREFIX}/_next/image`
        : '/_next/image',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.aerosportsparks.ca',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },

  // Use in-memory ISR cache (App Engine Standard has read-only filesystem)
  cacheMaxMemorySize: 50 * 1024 * 1024, // 50 MB

  experimental: {
    // Keep build-time sheet reads serialized to avoid Google Sheets 429s during static generation.
    cpus: 1,
    optimizePackageImports: ['react-bootstrap', 'react-icons', 'date-fns', 'xlsx', 'react-quill'],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // NOTE: this exposes envs to the client bundle; it does NOT affect process.env
  env: {
    NEXT_PUBLIC_API_URL: 'https://apis-351216.nn.r.appspot.com/api',
    NEXT_PUBLIC_BASE_URL: 'https://www.aerosportsparks.ca',
    SHEET_URL: 'https://docs.google.com/spreadsheets/d/1B_9EaTQDztWGH_cD3lUP7hpWD6FvNBJ-6Czml2x7d9c/export?format=xlsx',
  },
};

export default nextConfig;
