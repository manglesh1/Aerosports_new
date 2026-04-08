#!/usr/bin/env node
/**
 * Update image URLs in the Google Sheet from original → WebP
 *
 * This reads the image-url-mapping.json and updates all matching URLs
 * in the Google Sheet using the Sheets API.
 *
 * Prerequisites:
 *   npm install googleapis
 *   Set GOOGLE_APPLICATION_CREDENTIALS or use gcloud auth
 *
 * Usage:
 *   node scripts/update-sheet-urls.js              # Dry run (show changes)
 *   node scripts/update-sheet-urls.js --apply      # Apply changes to sheet
 */

const fs = require('fs');
const path = require('path');

const SHEET_ID = '1B_9EaTQDztWGH_cD3lUP7hpWD6FvNBJ-6Czml2x7d9c';
const MAPPING_FILE = path.join(__dirname, '..', 'image-url-mapping.json');

async function main() {
  const apply = process.argv.includes('--apply');

  console.log(`📊 Google Sheet URL Updater ${apply ? '(APPLY MODE)' : '(DRY RUN)'}`);
  console.log(`   Sheet: ${SHEET_ID}`);

  // Load mapping
  if (!fs.existsSync(MAPPING_FILE)) {
    console.error('❌ Mapping file not found. Run convert-to-webp.js first.');
    process.exit(1);
  }

  const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));
  console.log(`   Loaded ${Object.keys(mapping).length} URL mappings\n`);

  let google;
  try {
    const googleapis = require('googleapis');
    google = googleapis.google;
  } catch (e) {
    console.error('❌ googleapis not installed. Run: npm install googleapis');
    process.exit(1);
  }

  // Auth
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  // Get all sheet names
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const sheetNames = spreadsheet.data.sheets.map(s => s.properties.title);
  console.log(`   Sheets: ${sheetNames.join(', ')}\n`);

  let totalChanges = 0;
  const updates = [];

  for (const sheetName of sheetNames) {
    // Read all data from this sheet
    const range = `'${sheetName}'`;
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: range,
    });

    const rows = res.data.values || [];
    let sheetChanges = 0;

    for (let r = 0; r < rows.length; r++) {
      for (let c = 0; c < rows[r].length; c++) {
        const cell = rows[r][c];
        if (!cell || typeof cell !== 'string') continue;

        // Check if this cell contains any mapped URL
        let newValue = cell;
        for (const [oldUrl, newUrl] of Object.entries(mapping)) {
          if (newValue.includes(oldUrl)) {
            newValue = newValue.replace(oldUrl, newUrl);
          }
          // Also check URL-encoded version
          const encodedOld = oldUrl.replace(/ /g, '%20');
          if (newValue.includes(encodedOld)) {
            newValue = newValue.replace(encodedOld, newUrl.replace(/ /g, '%20'));
          }
        }

        if (newValue !== cell) {
          const colLetter = String.fromCharCode(65 + c); // A, B, C...
          const cellRef = `'${sheetName}'!${colLetter}${r + 1}`;

          console.log(`  ${cellRef}:`);
          console.log(`    OLD: ${cell.substring(0, 100)}...`);
          console.log(`    NEW: ${newValue.substring(0, 100)}...`);

          updates.push({ range: cellRef, values: [[newValue]] });
          sheetChanges++;
        }
      }
    }

    if (sheetChanges > 0) {
      console.log(`  📋 ${sheetName}: ${sheetChanges} cells to update\n`);
    }
    totalChanges += sheetChanges;
  }

  console.log(`\n📊 Total: ${totalChanges} cells to update across ${sheetNames.length} sheets`);

  if (apply && updates.length > 0) {
    console.log('\n⬆️  Applying changes...');

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        data: updates,
        valueInputOption: 'RAW',
      },
    });

    console.log('✅ All changes applied!');
  } else if (!apply && updates.length > 0) {
    console.log('\n💡 Run with --apply to make these changes:');
    console.log('   node scripts/update-sheet-urls.js --apply');
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
