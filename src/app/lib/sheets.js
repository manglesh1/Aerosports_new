// lib/sheet.js
const axios = require('axios');
const XLSX = require('xlsx');

const SHEET_URL = process.env.SHEET_URL;
const sheetCache = new Map();
const CACHE_TTL =  (parseInt(process.env.SHEET_CACHE_TTL_SECONDS || "86400", 10)) * 1000;
  const waiverLinkCache = new Map();
const reviewesData = new Map();
let sheetWorkbookRequest = null;

const GCS_MEDIA_PREFIX = "https://storage.googleapis.com/aerosports/";
const CDN_MEDIA_PREFIX = "https://media.aerosportsparks.ca/";

function normalizeMediaUrl(value) {
  if (typeof value !== "string") return value;
  if (value.startsWith(GCS_MEDIA_PREFIX)) {
    return `${CDN_MEDIA_PREFIX}${value.slice(GCS_MEDIA_PREFIX.length)}`;
  }
  return value;
}

function normalizeLocationList(value) {
  return String(value || "")
    .toLowerCase()
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isCorporateLocation(value) {
  const locations = normalizeLocationList(value);
  return locations.length === 0 || locations.includes("corporate");
}

async function fetchWorkbook() {
  if (!sheetWorkbookRequest) {
    sheetWorkbookRequest = (async () => {
      const bustedUrl = SHEET_URL
        ? `${SHEET_URL}${SHEET_URL.includes("?") ? "&" : "?"}_=${Date.now()}`
        : SHEET_URL;

      const response = await fetch(bustedUrl, {
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });

      if (!response.ok) {
        throw new Error(`Sheet fetch failed: ${response.status} ${response.statusText}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      return XLSX.read(buffer, { type: "buffer" });
    })().finally(() => {
      sheetWorkbookRequest = null;
    });
  }

  return sheetWorkbookRequest;
}

async function fetchsheetdata(sheetName, location) {
  if (sheetName === 'refresh') {
    // Clear every in-process read cache so the next request re-fetches live.
    sheetCache.clear();
    waiverLinkCache.clear();
    reviewesData.clear();
    mediaMapCache.map = null;
    mediaMapCache.timestamp = 0;
    return [];
  }
  if (location === '.well-known') return [];

  const cacheKey = `${sheetName}:${location === '' ? '_corporate' : location || 'all'}`;
  const now = Date.now();
  const cached = sheetCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return await resolveMaybe(sheetName, cached.data);
  }
  try {
    const workbook = await fetchWorkbook();

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
        const normalizedLoc = String(loc || '').toLowerCase().trim();
        const filtered = sheetData.filter(
          (m) => {
            const rowLocations = normalizeLocationList(m.location);
            return rowLocations.length === 0 || rowLocations.includes(normalizedLoc);
          }
        );
        sheetCache.set(`${name}:${loc}`, { data: filtered, timestamp: now });
      });
      // Cache corporate rows separately. Use location="corporate" for content
      // that should appear on global pages such as /blogs but not on park pages.
      const corporateRows = sheetData.filter((m) => isCorporateLocation(m.location));
      sheetCache.set(`${name}:_corporate`, { data: corporateRows, timestamp: now });

      sheetCache.set(`${name}:all`, { data: sheetData, timestamp: now });
    });

    const result = sheetCache.get(cacheKey);
    return await resolveMaybe(sheetName, result ? result.data : []);
  } catch (error) {
    console.error(`❌ Error in fetchsheetdata("${sheetName}"):`, error.message);
    sheetCache.set('__lastError', { data: error.message, timestamp: Date.now() });
    return cached?.data || [];
  }
}

// --- Media library resolution -------------------------------------------------
// Content sheets can reference a row in the "media" sheet by its id. We transparently
// replace any field value that matches a media id with that media's desktop_url, and
// attach a `${field}_media` object (desktop_url, mobile_url, alt, title) for components
// that want the responsive/alt data. Values that aren't media ids (e.g. raw URLs) pass
// through unchanged — fully backwards-compatible and dormant until media ids are used.
let mediaMapCache = { map: null, timestamp: 0 };

async function getMediaMap() {
  const now = Date.now();
  if (mediaMapCache.map && now - mediaMapCache.timestamp < CACHE_TTL) {
    return mediaMapCache.map;
  }
  let rows = [];
  try {
    rows = await fetchsheetdata('media', 'all');
  } catch {
    rows = [];
  }
  const map = new Map();
  (Array.isArray(rows) ? rows : []).forEach((r) => {
    const id = r && r.id != null ? String(r.id).trim() : '';
    if (id) map.set(id, r);
  });
  mediaMapCache = { map, timestamp: now };
  return map;
}

function resolveMediaInData(data, mediaMap) {
  return data.map((row) => {
    let out = null;
    for (const key in row) {
      const v = row[key];
      if (typeof v === 'string' && v && mediaMap.has(v.trim())) {
        const m = mediaMap.get(v.trim());
        if (!out) out = { ...row };
        out[key] = normalizeMediaUrl(m.desktop_url || v);
        out[`${key}_media`] = {
          id: m.id,
          type: m.type || 'image',
          desktop_url: normalizeMediaUrl(m.desktop_url || ''),
          mobile_url: normalizeMediaUrl(m.mobile_url || ''),
          alt: m.alt || '',
          title: m.title || '',
        };
      } else if (typeof v === 'string') {
        const normalized = normalizeMediaUrl(v);
        if (normalized !== v) {
          if (!out) out = { ...row };
          out[key] = normalized;
        }
      }
    }
    return out || row;
  });
}

async function resolveMaybe(sheetName, data) {
  if (sheetName === 'media' || !Array.isArray(data) || data.length === 0) return data;
  const mediaMap = await getMediaMap();
  if (!mediaMap || mediaMap.size === 0) return data;
  return resolveMediaInData(data, mediaMap);
}

async function fetchsheetdataNoCache(sheetName) {
  const response = await axios.get(SHEET_URL, { responseType: 'arraybuffer' });
  const workbook = XLSX.read(response.data, { type: 'buffer' });
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) return [];
  return XLSX.utils.sheet_to_json(worksheet, { defval: '' });
}

/**
 * Builds menu data with nested children from "Data" sheet
 */
// Pages live in the "Data" sheet and blog posts in the "blogs" sheet, but most of the app
// treats them as one content set (menu hierarchy + page lookups), so merge them at read time.
// Safe before the blogs sheet exists: fetchsheetdata("blogs") returns [] -> just Data.
async function fetchContentData(location) {
  const [pages, blogs] = await Promise.all([
    fetchsheetdata("Data", location),
    fetchsheetdata("blogs", location),
  ]);
  return [
    ...(Array.isArray(pages) ? pages.filter((row) => !isBlogContentRow(row) || isPublishedSheetRow(row)) : []),
    ...(Array.isArray(blogs) ? blogs.filter(isPublishedSheetRow) : []),
  ];
}

function normalizeLookupSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/\s+/g, "-");
}

function getActiveSheetValue(row) {
  return row?.active ?? row?.isactive ?? "";
}

function isPublishedSheetRow(row) {
  const value = String(getActiveSheetValue(row)).trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

function isBlogContentRow(row) {
  return normalizeLookupSlug(row?.parentid) === "blogs";
}

async function fetchMenuData(location) {
  const jsonData = await fetchContentData(location);
  const hierarchy = {};

  // Which row wins for a given path is decided ONLY by the `location` column:
  // when rows share a path (e.g. a per-park "blogs" container vs. a blank/shared one),
  // the row whose location column matches the requested location wins; a blank row is
  // the fallback. This stops one park's row from leaking onto another park's page.
  const loc = (location || '').toLowerCase();
  const locRank = (row) => {
    const raw = String(row.location || '').toLowerCase();
    if (!loc) return raw ? 1 : 0;        // corporate (blank request): prefer blank rows
    if (!raw) return 1;                   // shared/blank row
    return raw.split(',').map((s) => s.trim()).includes(loc) ? 0 : 2; // exact column match wins
  };

  jsonData.forEach(item => {
    const existing = hierarchy[item.path];
    if (existing && locRank(existing) <= locRank(item)) return;
    const { section1, section2, ruleyes, ruleno, ...rest } = item;
    hierarchy[item.path] = { ...rest, children: [] };
  });

  const attached = new Set();
  jsonData.forEach(item => {
    if (item.parentid && hierarchy[item.parentid] && hierarchy[item.path] && !attached.has(item.path)) {
      hierarchy[item.parentid].children.push(hierarchy[item.path]);
      attached.add(item.path);
    }
  });

  return Object.values(hierarchy).filter(item => !item.parentid || !hierarchy[item.parentid]);
}

/**
 * Filter page-specific data
 */
async function fetchPageData(location, page, options = {}) {
  const { requireActive = false } = options;
  const jsonData = await fetchContentData(location);
  const pageSlug = normalizeLookupSlug(page);
  const locationSlug = (location || '').toLowerCase();
  const rowLocationRank = (row) => {
    const rawLocation = String(row.location || '').toLowerCase();
    if (!locationSlug) return rawLocation ? 1 : 0;
    if (!rawLocation) return 1;
    const locations = rawLocation.split(',').map((loc) => loc.trim());
    return locations.includes(locationSlug) ? 0 : 2;
  };
  const rowPageRank = (row) => {
    const path = normalizeLookupSlug(row.path);
    const desc = normalizeLookupSlug(row.desc);
    if (path === pageSlug) return 0;
    if (desc === pageSlug) return 1;
    return 2;
  };
  const filtered = jsonData.filter((row) => {
    if (rowLocationRank(row) > 1) return false;
    if (requireActive && !isPublishedSheetRow(row)) return false;
    return rowPageRank(row) < 2;
  });
  filtered.sort((a, b) => rowLocationRank(a) - rowLocationRank(b) || rowPageRank(a) - rowPageRank(b));
  return filtered[0];
}

async function fetchAttractionContent(location, path) {
  const jsonData = await fetchsheetdata("attractions", location);
  const requestedLocation = String(location || "").trim().toLowerCase();
  const requestedPath = normalizeLookupSlug(path);

  if (!Array.isArray(jsonData) || !requestedPath) return null;

  const locationRank = (row) => {
    const rawLocation = String(row.location || "").toLowerCase();
    if (!requestedLocation) return rawLocation ? 1 : 0;
    if (!rawLocation) return 1;
    return rawLocation.split(",").map((item) => item.trim()).includes(requestedLocation) ? 0 : 2;
  };

  const filtered = jsonData.filter((row) => {
    if (locationRank(row) > 1) return false;
    return normalizeLookupSlug(row.path) === requestedPath;
  });

  filtered.sort((a, b) => locationRank(a) - locationRank(b));
  return filtered[0] || null;
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
  let canonicalPath = location || '';
  if (category && page) {
    canonicalPath += `/${category}/${page}`;
  } else if (page && page !== 'home') {
     canonicalPath += canonicalPath ? `/${page}` : page;
  } else if (category) {
    canonicalPath += canonicalPath ? `/${category}` : category;
  }

  const fullUrl = canonicalPath ? `${BASE_URL}/${canonicalPath}` : BASE_URL;
  const imageUrl = metadataItem?.headerimage?.startsWith("http")
    ? metadataItem.headerimage
    : `${BASE_URL}${metadataItem?.headerimage || ""}`;

  const metaTitle = metadataItem?.metatitle || metadataItem?.title || metadataItem?.desc || "AeroSports Trampoline Park";
  const metaDesc = metadataItem?.metadescription || metadataItem?.smalltext || metadataItem?.subtitle || metadataItem?.text || "Fun for all ages at AeroSports!";
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
  const locationSegment = String(
    pagedata?.location || locationData?.[0]?.location || ''
  ).split(',')[0].trim().toLowerCase();
  const canonicalPath = [locationSegment, category, page]
    .filter(Boolean)
    .join('/');
  const fullUrl = canonicalPath ? `${BASE_URL}/${canonicalPath}` : BASE_URL;
  const imageUrl = metadataItem?.headerimage?.startsWith("http")
    ? metadataItem.headerimage
    : `${BASE_URL}${metadataItem?.headerimage || ""}`;

  const filled = locationData?.[0]?.schema
  .replace('"{{metadesc}}"', JSON.stringify(metadataItem?.metadescription || metadataItem?.smalltext || metadataItem?.subtitle || metadataItem?.text || "Fun for all ages at AeroSports!"))
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

function normalizeGalleryPath(value) {
  if (value === undefined || value === null) return "";
  let cleaned = String(value).trim().toLowerCase();

  if (!cleaned) return "";

  try {
    if (/^https?:\/\//i.test(cleaned)) {
      cleaned = new URL(cleaned).pathname;
    }
  } catch {
    // Leave non-URL values as-is.
  }

  return cleaned
    .replace(/[?#].*$/, "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\s+/g, "-");
}

function splitGalleryPaths(value) {
  return String(value || "")
    .split(/[\n,|]+/)
    .map(normalizeGalleryPath)
    .filter(Boolean);
}

function galleryRowMatchesPath(rowPath, pagePaths) {
  const requestedPaths = Array.isArray(pagePaths)
    ? pagePaths.map(normalizeGalleryPath).filter(Boolean)
    : splitGalleryPaths(pagePaths);

  if (requestedPaths.length === 0) return true;

  const rowPaths = splitGalleryPaths(rowPath);
  if (rowPaths.length === 0) return false;

  return rowPaths.some((rowValue) =>
    requestedPaths.some((requestedValue) =>
      rowValue === requestedValue ||
      rowValue.endsWith(`/${requestedValue}`) ||
      requestedValue.endsWith(`/${rowValue}`)
    )
  );
}

/**
 * Fetch photo gallery data from "photo gallery" sheet
 * Returns organized data by navbar groups with parsed URLs
 */
async function fetchGalleryData(location, pagePaths = "") {
  try {
    const jsonData = await fetchsheetdata("photo gallery", location);

    if (!jsonData || jsonData.length === 0) {
      console.warn(`No photo gallery data found for location: ${location}`);
      return {};
    }

    // Group data by navbar > group (one URL per row format)
    const groupedData = {};

    jsonData.forEach(row => {
      if (!galleryRowMatchesPath(row.path, pagePaths)) return;

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
  fetchAttractionContent,
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
