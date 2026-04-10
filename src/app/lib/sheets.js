// lib/sheet.js
const axios = require('axios');
const XLSX = require('xlsx');

const SHEET_URL = process.env.SHEET_URL;
const sheetCache = new Map();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes — short enough that sheet edits show up quickly
const waiverLinkCache = new Map();
const reviewesData = new Map();

async function fetchsheetdata(sheetName, location) {
  if (sheetName === 'refresh') {
    sheetCache.clear();
    return [];
  }
  if (location === '.well-known') return [];

  const cacheKey = `${sheetName}:${location || 'all'}`;
  const now = Date.now();
  const cached = sheetCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    // Cache-bust the Google Sheets export endpoint so we don't get a stale
    // CDN copy after editing the sheet.
    const bustedUrl = SHEET_URL
      ? `${SHEET_URL}${SHEET_URL.includes('?') ? '&' : '?'}_=${Date.now()}`
      : SHEET_URL;
    const response = await axios.get(bustedUrl, {
      responseType: 'arraybuffer',
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    });
    const workbook = XLSX.read(response.data, { type: 'buffer' });

    const worksheetLocationsData = workbook.Sheets['locations'];
    const jsonLocationsData = XLSX.utils.sheet_to_json(worksheetLocationsData, { defval: '' });
    sheetCache.set('locations:all', { data: jsonLocationsData, timestamp: now });

    const distinctLocations = Array.from(
      new Set(jsonLocationsData.map((r) => r.location).filter(Boolean))
    );

    workbook.SheetNames.forEach((name) => {
      const worksheet = workbook.Sheets[name];
      let sheetData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (name === 'config') {
        sheetData = sheetData.map((m) => ({
          ...m,
          value: typeof m.value === 'string'
            ? m.value.replace(/\r?\n|\r/g, '<br/>')
            : m.value,
        }));
      }

      distinctLocations.forEach((loc) => {
        const filtered = sheetData.filter(
          (m) => (m.location || '').includes(loc) || m.location === ''
        );
        sheetCache.set(`${name}:${loc}`, { data: filtered, timestamp: now });
      });
      sheetCache.set(`${name}:all`, { data: sheetData, timestamp: now });
    });

    const result = sheetCache.get(cacheKey);
    return result ? result.data : [];
  } catch (error) {
    console.error(`❌ Error in fetchsheetdata("${sheetName}"):`, error.message);
    sheetCache.set('__lastError', { data: error.message, timestamp: Date.now() });
    return cached?.data || [];
  }
}

async function fetchsheetdataNoCache(sheetName) {
  const response = await axios.get(SHEET_URL, { responseType: 'arraybuffer' });
  const workbook = XLSX.read(response.data, { type: 'buffer' });
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet, { defval: '' });
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
  const filtered= jsonData.filter(m => m.path?.toUpperCase().includes(page.toUpperCase()));
  return filtered[0];
}
async function fetchFaqData(location, page) {
  const jsonData = await fetchsheetdata("faq", location);
  return jsonData.filter(m => m.path?.toUpperCase().includes(page.toUpperCase()));
}

async function getWaiverLink(location){
  const cacheKey = `waiver:${location}`;
  const cached = waiverLinkCache.get(cacheKey);
  //console.log(cacheKey, cached);
  if(cached)
  {
       return cached;
  }
  const dataconfig = await fetchsheetdata('config', location);  
  const waiver1 = Array.isArray(dataconfig) ? dataconfig.find((item) => item.key === "waiver") : null;
  const waiver=waiver1?.value;
  waiverLinkCache.set(cacheKey,waiver);
  return waiver;
}
 

async function generateMetadataLib({ location, category, page }) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const pagefordata = page?page:'home';
  const data = await fetchPageData(location, pagefordata);

  const metadataItem = data;//?.find((item) => item.path === pagefordata);
//console.log(pagefordata);
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

  const metaTitle = metadataItem?.metatitle || "AeroSports Trampoline Park";
  const metaDesc = metadataItem?.metadescription || "Fun for all ages at AeroSports!";
  const isBlogPost = category === 'blogs' || page?.includes('blog');

  return {
    title: metaTitle,
    description: metaDesc,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: fullUrl,
      siteName: "AeroSports Trampoline Park",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: metaTitle,
            },
          ]
        : [],
      locale: "en_CA",
      type: isBlogPost ? "article" : "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDesc,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

// Reviews cache: refresh from API once per day, serve from memory for the rest.
const REVIEWS_TTL = 1000 * 60 * 60 * 24; // 24 hours

async function getReviewsData(locationid){
  if(!locationid || locationid=='undefined')
    return [];

  const cacheKey = `reviews:${locationid}`;
  const cached = reviewesData.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < REVIEWS_TTL) {
    return cached.data;
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/getreviews?locationid=${locationid}`;
    // Next.js fetch revalidation aligned to 24h so the framework cache also refreshes daily.
    const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
    const data = await response.json();
    reviewesData.set(cacheKey, { data, timestamp: now });
    return data;
  } catch (error) {
    console.error(`❌ Error in getReviewsData("${locationid}"):`, error.message);
    // On failure, fall back to stale cache if available so the page still renders real reviews.
    return cached?.data || [];
  }
}
   
async function generateSchema(pagedata, locationData, category, page ) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const metadataItem = pagedata;//?.find((item) => item.path === pagefordata);
//console.log('pagedata', pagedata);
  let canonicalPath = pagedata?.location;
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

  const filled = locationData?.[0]?.schema
  .replace('"{{metadesc}}"', JSON.stringify(metadataItem?.metadescription || "Fun for all ages at AeroSports!"))
  .replace('"{{image}}"', JSON.stringify(imageUrl))
  .replace('"{{url}}"', JSON.stringify(fullUrl));

  return     filled;

}

/**
 * Fetch and parse the page-json-data column for the home page from the Data sheet.
 * This returns the parsed JSON object containing all home-page text content
 * (hero, highlights, attractions section, party, why-choose, ticker, final CTA, etc.)
 * that does NOT live in dedicated columns.
 */
async function fetchHomePageJsonData(location) {
  try {
    const jsonData = await fetchsheetdata("Data", location);
    if (!Array.isArray(jsonData)) return null;

    const homeRow = jsonData.find(
      (row) => row.path === "home" && row.location === location
    );
    if (!homeRow || !homeRow["page-json-data"]) return null;

    const raw = String(homeRow["page-json-data"]).trim();
    if (!raw) return null;

    return JSON.parse(raw);
  } catch (error) {
    console.error(
      `Error parsing home page-json-data for ${location}:`,
      error.message
    );
    return null;
  }
}

/**
 * Fetch and parse birthday party pricing JSON data from Google Sheets
 */
async function fetchBirthdayPartyJson(location) {
  try {
    const jsonData = await fetchsheetdata("birthdaypage", location);

    if (!jsonData || jsonData.length === 0) {
      console.warn(`No birthday party data found for location: ${location}`);
      return null;
    }

    // Find the row for this location
    const locationRow = jsonData.find(row =>
      row.location?.toLowerCase() === location?.toLowerCase()
    );

    if (!locationRow || !locationRow.json) {
      console.warn(`No JSON data found for location: ${location}`);
      return null;
    }

    // Parse the JSON string from the json column
    const parsedData = JSON.parse(locationRow.json);
    return parsedData;
  } catch (error) {
    console.error(`Error fetching birthday party JSON for ${location}:`, error.message);
    return null;
  }
}

/**
 * Fetch photo gallery data from "photo gallery" sheet
 * Returns organized data by navbar groups with parsed URLs
 */
async function fetchGalleryData(location) {
  try {
    const jsonData = await fetchsheetdata("photo gallery", location);

    if (!jsonData || jsonData.length === 0) {
      console.warn(`No photo gallery data found for location: ${location}`);
      return {};
    }

    // Group data by navbar > group (one URL per row format)
    const groupedData = {};

    jsonData.forEach(row => {
      const navbar = row.navbar || 'gallery';
      const group = row.group || '';
      const url = row.urls ? row.urls.trim() : '';

      if (!url) return;

      if (!groupedData[navbar]) {
        groupedData[navbar] = [];
      }

      // Find existing group or create new one
      let existingGroup = groupedData[navbar].find(g => g.group === group);
      if (!existingGroup) {
        existingGroup = {
          group: group,
          urls: [],
          titles: [],
          alttexts: [],
          location: row.location
        };
        groupedData[navbar].push(existingGroup);
      }

      existingGroup.urls.push(url);
      existingGroup.titles.push(row.title || '');
      existingGroup.alttexts.push(row.alttext || '');
    });

    return groupedData;
  } catch (error) {
    console.error(`Error fetching gallery data for ${location}:`, error.message);
    return {};
  }
}

/**
 * Fetch pricing table data from "pricingtable" sheet
 * Returns table data with header and footer
 */
async function fetchPricingTableData(location) {
  try {
    const jsonData = await fetchsheetdata("pricingtable", location);

    if (!jsonData || jsonData.length === 0) {
      console.warn(`No pricing table data found for location: ${location}`);
      return null;
    }

    // Find the row for this location
    const locationRow = jsonData.find(row =>
      row.location?.toLowerCase() === location?.toLowerCase()
    );

    if (!locationRow) {
      console.warn(`No pricing data found for location: ${location}`);
      return null;
    }

    // Parse the table JSON string
    let tableData = null;
    if (locationRow.table) {
      try {
        tableData = JSON.parse(locationRow.table);
      } catch (parseError) {
        console.error(`Error parsing table JSON for ${location}:`, parseError.message);
      }
    }

    return {
      table: tableData,
      header: locationRow.header || '',
      footer: locationRow.footer || ''
    };
  } catch (error) {
    console.error(`Error fetching pricing table data for ${location}:`, error.message);
    return null;
  }
}




function getLastSheetError() {
  return sheetCache.get('__lastError')?.data || null;
}

module.exports = {
  getLastSheetError,
  fetchsheetdata,
  fetchMenuData,
  fetchPageData,
  generateMetadataLib,
  fetchFaqData,
  getWaiverLink,
  getReviewsData,
  fetchsheetdataNoCache,
  generateSchema,
  fetchBirthdayPartyJson,
  fetchHomePageJsonData,
  fetchGalleryData,
  fetchPricingTableData
};
