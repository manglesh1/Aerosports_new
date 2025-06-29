// lib/sheet.js
const axios = require('axios');
const XLSX = require('xlsx');

const SHEET_URL = `https://docs.google.com/spreadsheets/d/1zpV1juNopYe4bnFP959w3ldwj0dC-3WF/export?format=xlsx`;

// In-memory cache (clears every serverless invocation or request)
const sheetCache = new Map();
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes in ms
/**
 * Fetch data from a specific Google Sheet, with basic in-request caching.
 */
async function fetchsheetdata(sheetName, location) {
  const cacheKey = `${sheetName}:${location || 'all'}`;
  const now = Date.now();
  
  const cached = sheetCache.get(cacheKey);

  // If cache is fresh, return it
  if (cached && now - cached.timestamp < CACHE_TTL) {
    console.log("✅ from cache" + cacheKey);
    return cached.data;
  }

  console.log("🚀 fetching fresh sheet data"+ cacheKey);

  try {
    const response = await axios.get(SHEET_URL, { responseType: 'arraybuffer' });
    const workbook = XLSX.read(response.data, { type: 'buffer' });
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) throw new Error(`Sheet "${sheetName}" not found.`);

    let jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    if (sheetName === 'config') {
      jsonData = jsonData.map(m => ({
        ...m,
        value: m.value.replace(/\r?\n|\r/g, "<br/>"),
      }));
    }

    const filteredData = !location
      ? jsonData
      : jsonData.filter(m => m.location?.includes(location) || m.location === "");

    // Cache the result with timestamp
    sheetCache.set(cacheKey, {
      data: filteredData,
      timestamp: now,
    });

    return filteredData;
  } catch (error) {
    console.error(`❌ Error in fetchsheetdata("${sheetName}"):`, error.message);
    throw error;
  }
}

/**
 * Builds menu data with nested children from "Data" sheet
 */
async function fetchMenuData(location) {
  const jsonData = await fetchsheetdata("Data", location);
  const hierarchy = {};

  jsonData.forEach(item => {
    const { section1, section2, ruleyes, ruleno, ...rest } = item;
    hierarchy[item.path] = { ...rest, children: [] };
  });

  jsonData.forEach(item => {
    if (item.parentid && hierarchy[item.parentid]) {
      hierarchy[item.parentid].children.push(hierarchy[item.path]);
    }
  });

  return Object.values(hierarchy).filter(item => !item.parentid || !hierarchy[item.parentid]);
}

/**
 * Filter page-specific data
 */
async function fetchPageData(location, page) {
  const jsonData = await fetchsheetdata("Data", location);
  return jsonData.filter(m => m.path?.toUpperCase().includes(page.toUpperCase()));
}
async function generateMetadataLib({ location, category, page }) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const pagefordata = page?page:'home';
  const data = await fetchPageData(location, pagefordata);

  const metadataItem = data?.find((item) => item.path === pagefordata);
console.log(pagefordata);
  // Construct canonical path
  let canonicalPath = location;
  if (category && page) {
    canonicalPath += `/${category}/${page}`;
  } else if (page) {
     canonicalPath += `/${page}`;
  } else if (category) {
    canonicalPath += `/${category}`;
  }

  const fullUrl = `${BASE_URL}/${canonicalPath}`;
  const imageUrl = metadataItem?.headerimage?.startsWith("http")
    ? metadataItem.headerimage
    : `${BASE_URL}${metadataItem?.headerimage || ""}`;

  return {
    title: metadataItem?.metatitle || "AeroSports Trampoline Park",
    description: metadataItem?.metadescription || "Fun for all ages at AeroSports!",
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: metadataItem?.metatitle || "AeroSports Trampoline Park",
      description: metadataItem?.metadescription || "Fun for all ages at AeroSports!",
      url: fullUrl,
      siteName: "AeroSports Trampoline Park",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: `AeroSports – ${location}`,
            },
          ]
        : [],
      locale: "en_CA",
      type: "website",
    },
  };
}


module.exports = {
  fetchsheetdata,
  fetchMenuData,
  fetchPageData,
  generateMetadataLib,
};
