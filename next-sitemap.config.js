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
    const dynamicUrlsSet = new Set();
    const siteUrl = 'https://www.aerosportsparks.ca';
    const locations = ['oakville', 'london', 'st-catharines', 'windsor','scarborough'];  

    try {
      const API_URL = 'https://apis-351216.nn.r.appspot.com';
      const response = await fetchData(`${API_URL}/api/fetchmenudata`);

      if (Array.isArray(response)) {
        response.forEach(nav => {
          const { parentid, path, isactive, children } = nav;

          if (!isactive) return;

          locations.forEach(loc => {
            // Generate main paths
            if (!parentid || parentid.toLowerCase() === path.toLowerCase()) {
              dynamicUrlsSet.add(`${siteUrl}/${loc}/${path.toLowerCase()}`);
            } else {
              dynamicUrlsSet.add(`${siteUrl}/${loc}/${parentid}/${path.toLowerCase()}`);
            }

            // Generate URLs for child paths, if any
            if (children && Array.isArray(children)) {
              children.forEach(child => {
                dynamicUrlsSet.add(`${siteUrl}/${loc}/${child.parentid}/${child.path}`);
              });
            }
          });
        });

        // Map URLs to the sitemap format
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
