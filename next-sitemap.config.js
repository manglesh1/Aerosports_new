const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  siteUrl: 'https://www.aerosportsparks.ca',
  generateRobotsTxt: true,

  additionalPaths: async (config) => {
    const dynamicPaths = [];
    const dynamicUrlsSet = new Set();  // Use Set to avoid duplicate URLs
    const siteUrl = 'https://www.aerosportsparks.ca';

    try {
      const API_URL = 'https://apis-351216.nn.r.appspot.com';
      const response = await fetchData(`${API_URL}/api/fetchmenudata`);

      if (Array.isArray(response)) {
        response.forEach(nav => {
          const { location, parentid, path, isactive, children } = nav;

          // Skip inactive entries
         
          const d= ['oakville','london','st-catharines','windsor']
          d.forEach(l=>
              {
                dynamicUrlsSet.add(`${siteUrl}/${l}`);
              }

          )
          // Process locations, split by commas, and trim any whitespace
          const locations = location ? location.split(',').map(loc => loc.trim()) : d;

          // Only generate URLs for locations that exist in the `location` field
          locations.forEach(loc => {
            if (!parentid || parentid.toLowerCase() === path.toLowerCase()) {
              // URL for pages without a parent
              dynamicUrlsSet.add(`${siteUrl}/${loc}/${path.toLowerCase()}`);
            } else {
              // URL for pages with a parent
              dynamicUrlsSet.add(`${siteUrl}/${loc}/${parentid}/${path.toLowerCase()}`);
            }

            // Process children if they exist
            if (children && Array.isArray(children)) {
              children.forEach(child => {
                dynamicUrlsSet.add(`${siteUrl}/${loc}/${child.parentid}/${child.path}`);
              });
            }
          });
        });

        // Map the URLs to sitemap format
        dynamicUrlsSet.forEach(url => {
          dynamicPaths.push({
            loc: url,
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

    return dynamicPaths;
  },
};
