import { format } from 'date-fns';
import { fetchsheetdataNoCache } from "@/lib/sheets";

const SITE_URL = 'https://www.aerosportsparks.ca';

// Static routes that exist for every location
const STATIC_ROUTES = [
  { path: 'blogs', priority: 0.8, changefreq: 'weekly' },
  { path: 'kids-birthday-parties', priority: 0.8, changefreq: 'monthly' },
  { path: 'pricing-promos', priority: 0.8, changefreq: 'monthly' },
  { path: 'membership', priority: 0.7, changefreq: 'monthly' },
  { path: 'bogo', priority: 0.7, changefreq: 'monthly' },
  { path: 'gallery', priority: 0.6, changefreq: 'monthly' },
  { path: 'contactus', priority: 0.5, changefreq: 'monthly' }
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

export async function GET() {
  try {
    // Fetch both locations and data sheets in parallel
    const [locationRows, dataRows] = await Promise.all([
      fetchsheetdataNoCache("locations"),
      fetchsheetdataNoCache("Data")
    ]);

    // Extract and validate unique location slugs
    const validLocationSlugs = new Set();
    locationRows.forEach(row => {
      const slug = (row.location || row.locations || '').trim().toLowerCase();
      if (isValidLocation(slug)) {
        validLocationSlugs.add(slug);
      }
    });

    // Use Map to store URLs with their metadata (automatically handles duplicates)
    const urlMap = new Map();

    // Add root homepage
    urlMap.set(SITE_URL, createUrlEntry(1.0, 'weekly'));

    // Add location homepages
    validLocationSlugs.forEach(location => {
      urlMap.set(`${SITE_URL}/${location}`, createUrlEntry(0.9, 'weekly'));
    });

    // Add static routes for each location
    validLocationSlugs.forEach(location => {
      STATIC_ROUTES.forEach(route => {
        const url = `${SITE_URL}/${location}/${route.path}`;
        urlMap.set(url, createUrlEntry(route.priority, route.changefreq));
      });
    });

    // Process Data sheet for dynamic URLs
    dataRows.forEach(row => {
      const { location, parentid, path, isactive } = row;

      // Validate path
      if (!path || path.trim() === '') {
        return; // Skip empty paths
      }

      // Skip special paths
      if (path === 'home' || path === 'refresh') {
        return; // 'home' is handled as location homepage, 'refresh' is utility endpoint
      }

      // Filter inactive pages
      if (isactive !== undefined && isactive != 1) {
        return; // Skip inactive pages
      }

      // Parse and validate locations from comma-separated list
      const locations = location?.split(',').map(l => l.trim().toLowerCase()).filter(isValidLocation) || [];

      if (locations.length === 0) {
        return; // Skip if no valid locations
      }

      // Determine URL pattern and metadata based on parentid
      let urlPath, priority, changefreq;

      if (!parentid || parentid.toLowerCase() === path.toLowerCase()) {
        // Category page: /{location}/{path}
        urlPath = path.toLowerCase();
        priority = 0.7;
        changefreq = 'weekly';
      } else if (parentid.toLowerCase() === 'blogs') {
        // Blog post: /{location}/blogs/{path}
        urlPath = `blogs/${path.toLowerCase()}`;
        priority = 0.6;
        changefreq = 'monthly';
      } else {
        // Subcategory page: /{location}/{parentid}/{path}
        urlPath = `${parentid.toLowerCase()}/${path.toLowerCase()}`;
        priority = 0.6;
        changefreq = 'monthly';
      }

      // Add URL for each applicable location
      locations.forEach(loc => {
        const url = `${SITE_URL}/${loc}/${urlPath}`;
        urlMap.set(url, createUrlEntry(priority, changefreq));
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
