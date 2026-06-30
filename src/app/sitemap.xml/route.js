import { format } from 'date-fns';
import { fetchsheetdataNoCache } from "@/lib/sheets";

const SITE_URL = 'https://www.aerosportsparks.ca';
const OWNED_LOCATION_SLUGS = new Set([
  'windsor',
  'st-catharines',
]);

// Corporate routes that are not scoped to a park location
const CORPORATE_ROUTES = [
  { path: 'about-us', priority: 0.7, changefreq: 'monthly' },
  { path: 'attractions', priority: 0.7, changefreq: 'weekly' },
  { path: 'blogs', priority: 0.8, changefreq: 'weekly' },
  { path: 'contact-us', priority: 0.6, changefreq: 'monthly' },
  { path: 'corporate-events', priority: 0.7, changefreq: 'monthly' },
  { path: 'privacy-policy', priority: 0.3, changefreq: 'yearly' },
  { path: 'school-groups', priority: 0.7, changefreq: 'monthly' },
  { path: 'summer-camps', priority: 0.7, changefreq: 'monthly' },
  { path: 'team-celebrations', priority: 0.7, changefreq: 'monthly' },
];

const LOCATION_ROUTE_RULES = [
  { path: 'blogs', priority: 0.8, changefreq: 'weekly', type: 'blogs' },
  { path: 'kids-birthday-parties', priority: 0.8, changefreq: 'monthly', type: 'page' },
  { path: 'pricing-promos', priority: 0.8, changefreq: 'monthly', type: 'page' },
  { path: 'membership', priority: 0.7, changefreq: 'monthly', type: 'page' },
  { path: 'bogo', priority: 0.7, changefreq: 'monthly', type: 'page' },
  { path: 'gallery', priority: 0.6, changefreq: 'monthly', type: 'gallery' },
];

// Helper function to validate location strings
function isValidLocation(loc) {
  return loc &&
         loc.trim() !== '' &&
         loc !== 'undefined' &&
         loc !== 'null' &&
         loc !== '.well-known';
}

// Helper function to create URL entry
function createUrlEntry(priority, changefreq) {
  return { priority, changefreq };
}

function normalizeSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\s+/g, '-');
}

function isActiveRow(row) {
  const value = String(row?.isactive ?? '').trim().toLowerCase();
  return value === '' || value === '1' || value === 'true' || value === 'yes';
}

function isRedirectOnlyRow(row) {
  const path = normalizeSlug(row?.path);
  const parentId = normalizeSlug(row?.parentid);

  if (!path || path === 'refresh' || path === 'home') {
    return true;
  }

  if (['aboutus', 'contactus', 'contact-us', 'locations'].includes(path)) {
    return true;
  }

  return parentId === 'about-us' && ['contactus', 'contact-us'].includes(path);
}

function getOwnedLocations(value, options = {}) {
  const { expandBlank = false } = options;
  const locations = String(value || '')
    .split(',')
    .map((entry) => normalizeSlug(entry))
    .filter((entry) => entry && OWNED_LOCATION_SLUGS.has(entry));

  if (locations.length === 0 && expandBlank) {
    return Array.from(OWNED_LOCATION_SLUGS);
  }

  return locations;
}

function getLocationPathSet(rows, predicate = () => true, options = {}) {
  const lookup = new Map();
  const { expandBlank = false } = options;

  rows.forEach((row) => {
    if (!isActiveRow(row) || isRedirectOnlyRow(row) || !predicate(row)) {
      return;
    }

    const path = normalizeSlug(row.path);
    if (!path) {
      return;
    }

    getOwnedLocations(row.location, { expandBlank }).forEach((location) => {
      if (!lookup.has(location)) {
        lookup.set(location, new Set());
      }
      lookup.get(location).add(path);
    });
  });

  return lookup;
}

export async function GET() {
  try {
    // Fetch both locations and data sheets in parallel
    const [locationRows, pageRows, blogRows, galleryRows] = await Promise.all([
      fetchsheetdataNoCache("locations"),
      fetchsheetdataNoCache("Data"),
      fetchsheetdataNoCache("blogs"),
      fetchsheetdataNoCache("photo gallery"),
    ]);
    const pageDataRows = Array.isArray(pageRows) ? pageRows : [];
    const blogDataRows = Array.isArray(blogRows) ? blogRows : [];
    const galleryDataRows = Array.isArray(galleryRows) ? galleryRows : [];

    // Extract and validate unique location slugs
    const validLocationSlugs = new Set();
    locationRows.forEach(row => {
      const slug = normalizeSlug(row.location || row.locations || '');
      if (isValidLocation(slug) && OWNED_LOCATION_SLUGS.has(slug)) {
        validLocationSlugs.add(slug);
      }
    });

    const activePagePathsByLocation = getLocationPathSet(pageDataRows, () => true, { expandBlank: true });
    const activeBlogPathsByLocation = getLocationPathSet(blogDataRows);
    const galleryLocations = new Set(
      galleryDataRows
        .filter((row) => String(row.urls || '').trim())
        .flatMap((row) => getOwnedLocations(row.location))
    );

    // Use Map to store URLs with their metadata (automatically handles duplicates)
    const urlMap = new Map();

    // Add root homepage
    urlMap.set(SITE_URL, createUrlEntry(1.0, 'weekly'));

    // Add corporate static routes
    CORPORATE_ROUTES.forEach(route => {
      urlMap.set(`${SITE_URL}/${route.path}`, createUrlEntry(route.priority, route.changefreq));
    });

    // Add location homepages
    validLocationSlugs.forEach(location => {
      urlMap.set(`${SITE_URL}/${location}`, createUrlEntry(0.9, 'weekly'));
    });

    // Add static routes for each owned location only when backing data exists.
    validLocationSlugs.forEach(location => {
      LOCATION_ROUTE_RULES.forEach((route) => {
        const pagePaths = activePagePathsByLocation.get(location) || new Set();
        const blogPaths = activeBlogPathsByLocation.get(location) || new Set();
        const shouldInclude =
          route.type === 'gallery'
            ? galleryLocations.has(location)
            : route.type === 'blogs'
              ? blogPaths.size > 0
              : pagePaths.has(route.path);

        if (!shouldInclude) {
          return;
        }

        urlMap.set(
          `${SITE_URL}/${location}/${route.path}`,
          createUrlEntry(route.priority, route.changefreq)
        );
      });
    });

    // Add corporate blog detail URLs.
    blogDataRows.forEach((row) => {
      if (!isActiveRow(row) || isRedirectOnlyRow(row)) {
        return;
      }

      const path = normalizeSlug(row.path);
      if (!path || getOwnedLocations(row.location).length > 0) {
        return;
      }

      urlMap.set(`${SITE_URL}/blogs/${path}`, createUrlEntry(0.6, 'monthly'));
    });

    // Process location-scoped dynamic page URLs. Blank location rows act as shared fallbacks.
    pageDataRows.forEach((row) => {
      if (!isActiveRow(row) || isRedirectOnlyRow(row)) {
        return;
      }

      const path = normalizeSlug(row.path);
      const parentId = normalizeSlug(row.parentid);
      const locations = getOwnedLocations(row.location, { expandBlank: true });

      if (!path || locations.length === 0) {
        return;
      }

      let urlPath;
      let priority;
      let changefreq;

      if (!parentId || parentId === path) {
        urlPath = path;
        priority = 0.7;
        changefreq = 'weekly';
      } else if (parentId === 'blogs') {
        urlPath = `blogs/${path}`;
        priority = 0.6;
        changefreq = 'monthly';
      } else {
        urlPath = `${parentId}/${path}`;
        priority = 0.6;
        changefreq = 'monthly';
      }

      locations.forEach((location) => {
        urlMap.set(`${SITE_URL}/${location}/${urlPath}`, createUrlEntry(priority, changefreq));
      });
    });

    // Process location-scoped blog detail URLs only when the row is explicitly tied to a location.
    blogDataRows.forEach((row) => {
      if (!isActiveRow(row) || isRedirectOnlyRow(row)) {
        return;
      }

      const path = normalizeSlug(row.path);
      const locations = getOwnedLocations(row.location);

      if (!path || locations.length === 0) {
        return;
      }

      locations.forEach((location) => {
        urlMap.set(`${SITE_URL}/${location}/blogs/${path}`, createUrlEntry(0.6, 'monthly'));
      });
    });

    // Generate XML sitemap
    const lastmod = format(new Date(), 'yyyy-MM-dd');
    const urls = Array.from(urlMap.entries()).map(([url, metadata]) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${metadata.changefreq}</changefreq>
    <priority>${metadata.priority}</priority>
  </url>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });

  } catch (error) {
    console.error("Sitemap generation error:", error);

    // Return minimal fallback sitemap with just homepage
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${format(new Date(), 'yyyy-MM-dd')}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(fallbackXml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}
