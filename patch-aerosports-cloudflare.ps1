cd "C:\code\Aerosports_new - Copy - Copy"
$next = "next.config.mjs"
$t = Get-Content -LiteralPath $next -Raw
if ($t -notmatch 'cpus:\s*1') {
  $t = $t -replace "experimental:\s*\{\r?\n\s*optimizePackageImports:", "experimental: {`r`n    // Keep build-time sheet reads serialized to avoid Google Sheets 429s during static generation.`r`n    cpus: 1,`r`n    optimizePackageImports:"
  Set-Content -LiteralPath $next -Value $t -Encoding utf8
}
$sheets = "src\app\lib\sheets.js"
$t = Get-Content -LiteralPath $sheets -Raw
if ($t -notmatch 'let sheetWorkbookRequest') {
  $t = $t -replace "const reviewesData = new Map\(\);", "const reviewesData = new Map();`r`nlet sheetWorkbookRequest = null;"
}
if ($t -notmatch 'async function fetchWorkbook') {
  $insert = @"

async function fetchWorkbook() {
  if (!sheetWorkbookRequest) {
    sheetWorkbookRequest = (async () => {
      const bustedUrl = SHEET_URL
        ? `${SHEET_URL}${SHEET_URL.includes('?') ? '&' : '?'}_=${Date.now()}`
        : SHEET_URL;
      const response = await axios.get(bustedUrl, {
        responseType: 'arraybuffer',
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      });
      return XLSX.read(response.data, { type: 'buffer' });
    })().finally(() => {
      sheetWorkbookRequest = null;
    });
  }
  return sheetWorkbookRequest;
}
"@
  $t = $t -replace "async function fetchsheetdata\(sheetName, location\) \{", ($insert + "`r`nasync function fetchsheetdata(sheetName, location) {")
}
$t = $t -replace "\r?\nconsole\.log\(cacheKey, cached\);", ""
$pattern = @"
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
"@
$t = $t.Replace($pattern, "    const workbook = await fetchWorkbook();`r`n")
Set-Content -LiteralPath $sheets -Value $t -Encoding utf8
Write-Host "Patched Next build concurrency and sheet in-flight cache." -ForegroundColor Green
Write-Host "Now run: npm run deploy:cf" -ForegroundColor Cyan