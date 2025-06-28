// lib/sheet.js
const axios = require('axios');
const XLSX = require('xlsx');

const SHEET_URL = `https://docs.google.com/spreadsheets/d/1zpV1juNopYe4bnFP959w3ldwj0dC-3WF/export?format=xlsx`;

// In-memory cache (clears every serverless invocation or request)
const sheetCache = new Map();

/**
 * Fetch data from a specific Google Sheet, with basic in-request caching.
 */
async function fetchsheetdata(sheetName, location) {
  const cacheKey = `${sheetName}:${location || 'all'}`;
  if (sheetCache.has(cacheKey)) {
    console.log('from cache');
    return sheetCache.get(cacheKey);
    
  }
  console.log('from non cache');
  try {
    const response = await axios.get(SHEET_URL, { responseType: 'arraybuffer' });
    const data = response.data;
    const workbook = XLSX.read(data, { type: 'buffer' });
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

    sheetCache.set(cacheKey, filteredData);
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

module.exports = {
  fetchsheetdata,
  fetchMenuData,
  fetchPageData,
};
