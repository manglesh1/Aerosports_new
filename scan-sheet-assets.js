const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1B_9EaTQDztWGH_cD3lUP7hpWD6FvNBJ-6Czml2x7d9c/export?format=xlsx';
const outDir = path.join(process.cwd(), 'asset-migration');
const outJson = path.join(outDir, 'sheet-assets.json');
const outTxt = path.join(outDir, 'sheet-assets.txt');
const mediaExt = /\.(?:avif|bmp|gif|jpe?g|png|svg|webp|ico|mp4|m4v|mov|webm|avi|mpe?g|ogv)(?:$|[?#])/i;

function normalizeCellText(value) {
  return String(value ?? '')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&')
    .replace(/\u0026/g, '&');
}

function cleanObjectPath(raw) {
  let s = raw.trim();
  s = s.replace(/[\\"'<>\]\[)}]+$/g, '');
  s = s.split('#')[0].split('?')[0];
  try { s = decodeURIComponent(s); } catch {}
  return s.replace(/^\/+/, '');
}

function extractPaths(text) {
  const paths = [];
  const normalized = normalizeCellText(text);
  const patterns = [
    /https?:\/\/storage\.googleapis\.com\/aerosports\/([^\s"'<>\])}]+)/gi,
    /https?:\/\/storage\.cloud\.google\.com\/aerosports\/([^\s"'<>\])}]+)/gi,
    /gs:\/\/aerosports\/([^\s"'<>\])}]+)/gi,
  ];
  for (const pattern of patterns) {
    for (const match of normalized.matchAll(pattern)) {
      const objectPath = cleanObjectPath(match[1]);
      if (mediaExt.test(objectPath)) paths.push(objectPath);
    }
  }
  return paths;
}

async function main() {
  await fs.promises.mkdir(outDir, { recursive: true });
  const response = await fetch(SHEET_URL);
  if (!response.ok) throw new Error(`Sheet export failed: ${response.status} ${response.statusText}`);
  const workbook = XLSX.read(Buffer.from(await response.arrayBuffer()), { type: 'buffer', cellDates: false });

  const assets = new Map();
  for (const sheetName of workbook.SheetNames) {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: '', raw: false });
    rows.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell == null || cell === '') return;
        for (const objectPath of extractPaths(cell)) {
          if (!assets.has(objectPath)) {
            assets.set(objectPath, { objectPath, firstSeen: { sheetName, row: rowIndex + 1, col: colIndex + 1 }, occurrences: 0 });
          }
          assets.get(objectPath).occurrences += 1;
        }
      });
    });
  }

  const list = Array.from(assets.values()).sort((a, b) => a.objectPath.localeCompare(b.objectPath));
  await fs.promises.writeFile(outJson, JSON.stringify(list, null, 2));
  await fs.promises.writeFile(outTxt, list.map((a) => a.objectPath).join('\n') + (list.length ? '\n' : ''));

  const byExt = {};
  for (const item of list) {
    const ext = path.extname(item.objectPath).toLowerCase() || '(none)';
    byExt[ext] = (byExt[ext] || 0) + 1;
  }
  console.log(JSON.stringify({ count: list.length, byExt, outJson, outTxt }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
