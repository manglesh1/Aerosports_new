// lib/sheet.js
const axios = require('axios');
const XLSX = require('xlsx');

const sheetCache = new Map();
const CACHE_TTL = 1000 * 60 * 15; // 15 min
const waiverLinkCache = new Map();
const reviewesData = new Map();

const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../../api/service-account-creds.json');
const { JWT } = require('google-auth-library'); // ✅ correct

const SPREADSHEET_ID = '1m4sAEfIJUaIdnsKYBJeMe0FeESEtGU9ISRqJ_O9TFmo';
let doc;
const serviceAccountAuth = new JWT({
  email: creds.client_email,
  key: creds.private_key.replace(/\\n/g, '\n'), // ✅ fix line breaks if needed
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function authSheets() {
  //Function for authentication object
  const auth = new google.auth.GoogleAuth({
    keyFile: "../../api/service-account-creds.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  //Create client instance for auth
  const authClient = await auth.getClient();

  //Instance of the Sheets API
  const sheets = google.sheets({ version: "v4", auth: authClient });

  return {
    auth,
    authClient,
    sheets,
  };
}



async function initDoc() {
 // if (!doc) {
    doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
  //}
}

async function fetchsheetdata(sheetName, location) {
  const { sheets } = await authSheets();
  const getRows = await sheets.spreadsheets.values.get({
    spreadsheetId: id,
    range: "Data",
  });
  console.write(getRows);
  
}
const locationCache = new Map();
async function fetchLocationData(location)
{
  const cacheKey = `${sheetName}:${location || 'all'}`;
  const cached = locationCache.get(cacheKey);
   if(cached)
    return cached;
   if(location=='.well-known')
    {
      console.log('unknown location', location);
      return [];
    }
    
   const data =  fetchsheetdata('locations')
   locationCache.set(cacheKey,data);
   return data;
}

module.exports = {
  fetchsheetdata,
  fetchLocationData
};
