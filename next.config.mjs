// next.config.mjs
/** @type {import('next').NextConfig} */
import * as XLSX from 'xlsx';

// 1) Put this in .env.local (and in your CI/CD env):
// REDIRECT_SHEET_XLSX="https://docs.google.com/spreadsheets/d/XXX/export?format=xlsx"
const SHEET_URL = process.env.REDIRECT_SHEET_XLSX
  ?? 'https://docs.google.com/spreadsheets/d/1yHwTrDJQ5yadwlxgYlVVNFpDQ-w8ILEE/edit?usp=sharing&ouid=111554940659762157873&rtpof=true&sd=true'; // fallback

async function fetchSheetRedirects() {
  try {
    const res = await fetch(SHEET_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status} ${res.statusText}`);

    // Parse XLSX
    const buf = Buffer.from(await res.arrayBuffer());
    const wb = XLSX.read(buf, { type: 'buffer' });

    // Prefer a sheet named "redirects", else first sheet
    const ws = wb.Sheets['redirects'] ?? wb.Sheets[wb.SheetNames[0]];
    if (!ws) return [];

    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
//console.log('Redirects rows:', rows);
    const out = [];
    for (const r of rows) {
      // Be forgiving about column casing/names
      const source = String(r.source ?? '').trim();
      const destination = String(r.destination ?? '').trim();
      const raw = String(
        r.permanent?? r.code ?? r.Code ?? ''
      ).trim().toLowerCase();

      if (!source || !destination) continue;

      // permanent: true for 301 (or empty), false for 302
      const permanent =
        raw === '' || raw === '301' || raw === 'true' || raw === 'permanent' ||
        raw === '1' || raw === 'yes';

      out.push({ source, destination, permanent });
    }
    
    return out;
  } catch (e) {
    console.warn('[redirects] Failed to load sheet:', e.message);
    return [];
  }
}

const nextConfig = {
  async redirects() {
    const sheetRedirects = await fetchSheetRedirects();
console.log('Fetched redirects:', sheetRedirects);

    // (Optional) Keep a few hardcoded fallbacks here if you want
    // const staticRedirects = [ ... ];
    // return [...staticRedirects, ...sheetRedirects];

    return sheetRedirects;
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'www.aerosportsparks.ca' },
    ],
  },

  // NOTE: this exposes envs to the client bundle; it does NOT affect process.env
  env: {
    NEXT_PUBLIC_API_URL: 'https://apis-351216.nn.r.appspot.com/api',
    NEXT_PUBLIC_BASE_URL: 'https://www.aerosportsparks.ca',
    SHEET_URL: 'https://docs.google.com/spreadsheets/d/1yHwTrDJQ5yadwlxgYlVVNFpDQ-w8ILEE/export?format=xlsx',
  },
};

export default nextConfig;
