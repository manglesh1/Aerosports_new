// next.config.mjs
/** @type {import('next').NextConfig} */
import * as XLSX from 'xlsx';

// 1) Put this in .env.local (and in your CI/CD env):
// REDIRECT_SHEET_XLSX="https://docs.google.com/spreadsheets/d/XXX/export?format=xlsx"
const SHEET_URL = process.env.REDIRECT_SHEET_XLSX
  ?? 'https://docs.google.com/spreadsheets/d/1B_9EaTQDztWGH_cD3lUP7hpWD6FvNBJ-6Czml2x7d9c/export?format=xlsx';

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
        // HTML pages: cache at Cloudflare edge for 10 min, stale-while-revalidate for 1 hour.
        // Browsers always revalidate (max-age=0) so users never see truly stale content.
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=600, stale-while-revalidate=21600',
          },
        ],
      },
      {
        // Next.js static assets — immutable, cache forever (they have hashed filenames)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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

  // Image optimization disabled — all images are pre-optimized WebP on GCS.
  // Serving directly from GCS CDN is faster than proxying through /_next/image.
  images: { unoptimized: true },

  // Use in-memory ISR cache (App Engine Standard has read-only filesystem)
  cacheMaxMemorySize: 50 * 1024 * 1024, // 50 MB

  experimental: {
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
