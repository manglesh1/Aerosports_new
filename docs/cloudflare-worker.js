/**
 * Cloudflare Worker — path-based routing for www.aerosportsparks.ca
 *
 * Routes the Group3 cities (Oakville / London / Scarborough), their assets, and
 * their sitemap to the Group3 origin. Everything else falls through to the
 * origin Cloudflare already points at (the Main project).
 *
 * Deploy this on a route covering the zone, e.g. `www.aerosportsparks.ca/*`.
 * Fill in GROUP3_ORIGIN with the Group3 deployment's public hostname.
 */

const GROUP3_ORIGIN = "https://REPLACE-WITH-GROUP3-HOST"; // e.g. https://group3-dot-PROJECT.uc.r.appspot.com

// Public city paths owned by the Group3 codebase.
const GROUP3_PATHS = ["/oakville", "/london", "/scarborough"];

// Must match `assetPrefix` in the Group3 project's next.config.mjs.
const GROUP3_ASSET_PREFIX = "/_g3";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname.toLowerCase();

    const isGroup3City = GROUP3_PATHS.some(
      (p) => path === p || path.startsWith(p + "/")
    );
    const isGroup3Sitemap = path === "/sitemap-group3.xml";
    const isGroup3Asset = path.startsWith(GROUP3_ASSET_PREFIX + "/");

    // City pages + sitemap: forward the path unchanged to Group3.
    if (isGroup3City || isGroup3Sitemap) {
      const dest = new URL(url.pathname + url.search, GROUP3_ORIGIN);
      return fetch(new Request(dest, request));
    }

    // Assets: strip the /_g3 prefix so Group3 serves them from /_next/...
    if (isGroup3Asset) {
      const dest = new URL(
        url.pathname.slice(GROUP3_ASSET_PREFIX.length) + url.search,
        GROUP3_ORIGIN
      );
      return fetch(new Request(dest, request));
    }

    // Default: pass through to the origin Cloudflare already points at (Main).
    return fetch(request);
  },
};
