import { format } from 'date-fns';

// Fetch data helper function
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  const dynamicPaths = [];
  const dynamicUrlsSet = new Set(); // Use Set to avoid duplicate URLs
  const siteUrl = 'https://www.aerosportsparks.ca';

  try {
    const API_URL = 'https://apis-351216.nn.r.appspot.com';
    const response = await fetchData(`${API_URL}/api/fetchmenudata`);

    if (Array.isArray(response)) {
      response.forEach(nav => {
        const { location, parentid, path, isactive, children } = nav;

        // Default locations array
        const locations = location ? location.split(',').map(loc => loc.trim()) : ['oakville', 'london', 'st-catharines', 'windsor'];

        locations.forEach(loc => {
          if (!parentid || parentid.toLowerCase() === path.toLowerCase()) {
            dynamicUrlsSet.add(`${siteUrl}/${loc}/${path.toLowerCase()}`);
          } else {
            dynamicUrlsSet.add(`${siteUrl}/${loc}/${parentid}/${path.toLowerCase()}`);
          }

          // Process child paths if they exist
          if (children && Array.isArray(children)) {
            children.forEach(child => {
              dynamicUrlsSet.add(`${siteUrl}/${loc}/${child.parentid}/${child.path}`);
            });
          }
        });
      });

      // Map URLs to sitemap XML format
      dynamicUrlsSet.forEach(url => {
        dynamicPaths.push({
          loc: url,
          lastmod: format(new Date(), 'yyyy-MM-dd'),
          changefreq: 'daily',
          priority: 0.7,
        });
      });
    } else {
      console.error('Expected an array but got:', response);
    }
  } catch (error) {
    console.error('Error fetching menu data:', error);
  }

  // Build the XML structure for the sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${dynamicPaths
        .map((url) => {
          return `
            <url>
              <loc>${url.loc}</loc>
              <lastmod>${url.lastmod}</lastmod>
              <changefreq>${url.changefreq}</changefreq>
              <priority>${url.priority}</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>`;

  // Set the response headers to indicate XML content
  res.setHeader('Content-Type', 'application/xml');
  res.write(sitemap);
  res.end();
}
