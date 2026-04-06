/**
 * DEPRECATED - This configuration is no longer used.
 *
 * The sitemap is now generated dynamically via the route handler at:
 * src/app/sitemap.xml/route.js
 *
 * This provides real-time updates from Google Sheets without requiring rebuilds.
 *
 * The postbuild script has been removed from package.json to prevent conflicts.
 */

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aerosportsparks.ca',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/admin', '/admin/*', '/api/*', '/test'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
  },
}
