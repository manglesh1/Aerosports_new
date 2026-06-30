import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Service account credentials. Prefer the env var; fall back to the existing creds file
// so the prototype works immediately. MOVE TO THE ENV VAR (and delete the file) for production.
function getCreds() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  }
  try {
    const p = join(process.cwd(), "src", "app", "api", "sheet", "service-account-creds.json");
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    throw new Error("No Google service account credentials. Set GOOGLE_SERVICE_ACCOUNT_JSON.");
  }
}

// Write to the SAME spreadsheet the public site reads (SHEET_URL), unless overridden.
function getSpreadsheetId() {
  if (process.env.STUDIO_SHEET_ID) return process.env.STUDIO_SHEET_ID;
  const m = (process.env.SHEET_URL || "").match(/\/d\/([a-zA-Z0-9-_]+)/);
  return m ? m[1] : "1B_9EaTQDztWGH_cD3lUP7hpWD6FvNBJ-6Czml2x7d9c";
}

// --- In-memory caches (per server instance) to stay under Sheets API read quotas.
// The Sheets API caps reads at ~60/min/user; without caching, every grid load,
// row editor and media picker hit the API live and blow the limit. ---
const DOC_TTL = 60_000; // reuse the loaded spreadsheet handle for 1 min
const READ_TTL = 20_000; // serve a tab's rows from memory for 20s
let docCache = null; // { at, doc }
const readCache = new Map(); // tab -> { at, data }

async function loadDoc() {
  const creds = getCreds();
  const auth = new JWT({
    email: creds.client_email,
    key: (creds.private_key || "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const doc = new GoogleSpreadsheet(getSpreadsheetId(), auth);
  await doc.loadInfo();
  return doc;
}

async function getDoc() {
  if (docCache && Date.now() - docCache.at < DOC_TTL) return docCache.doc;
  const doc = await loadDoc();
  docCache = { at: Date.now(), doc };
  return doc;
}

// Drop cached rows so the next read is live. Call after any write.
export function bustSheetCache(tab) {
  if (tab) readCache.delete(tab);
  else readCache.clear();
}

function pickHeaders(headers, data) {
  const out = {};
  for (const h of headers) if (h in data) out[h] = data[h] ?? "";
  return out;
}

export async function listTabs() {
  const doc = await getDoc();
  return doc.sheetsByIndex.map((s) => ({ title: s.title, rows: s.rowCount, cols: s.columnCount }));
}

export async function getSheetData(tab, { fresh = false } = {}) {
  const hit = readCache.get(tab);
  if (!fresh && hit && Date.now() - hit.at < READ_TTL) return hit.data;

  const doc = await getDoc();
  const sheet = doc.sheetsByTitle[tab];
  if (!sheet) throw new Error(`Tab "${tab}" not found`);
  // getRows() loads the header row internally, so no separate loadHeaderRow() read.
  const rows = await sheet.getRows();
  const data = {
    tab,
    headers: sheet.headerValues,
    rows: rows.map((r, i) => ({ _rowIndex: i, ...r.toObject() })),
  };
  readCache.set(tab, { at: Date.now(), data });
  return data;
}

export async function addSheetRow(tab, data) {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle[tab];
  if (!sheet) throw new Error(`Tab "${tab}" not found`);
  await sheet.loadHeaderRow();
  await sheet.addRow(pickHeaders(sheet.headerValues, data));
  bustSheetCache(tab);
}

export async function updateSheetRow(tab, rowIndex, data) {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle[tab];
  if (!sheet) throw new Error(`Tab "${tab}" not found`);
  await sheet.loadHeaderRow();
  const rows = await sheet.getRows();
  const row = rows[rowIndex];
  if (!row) throw new Error(`Row ${rowIndex} not found`);
  row.assign(pickHeaders(sheet.headerValues, data));
  await row.save();
  bustSheetCache(tab);
}

export async function deleteSheetRow(tab, rowIndex) {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle[tab];
  if (!sheet) throw new Error(`Tab "${tab}" not found`);
  const rows = await sheet.getRows();
  const row = rows[rowIndex];
  if (!row) throw new Error(`Row ${rowIndex} not found`);
  await row.delete();
  bustSheetCache(tab);
}
