/**
 * Generate a single Google Apps Script file that updates all blog rows.
 * The data is stored as a compressed JSON in a temporary sheet cell,
 * then the script reads it and applies updates.
 *
 * Approach: Generate a CSV of [rowNumber, htmlContent] that gets
 * pasted into a temp sheet, then a short script processes it.
 */

const fs = require('fs');
const path = require('path');

const updates = JSON.parse(fs.readFileSync(path.join(__dirname, 'sheet-updates.json'), 'utf-8'));

// Generate individual script files small enough for Apps Script
// Each handles 3 rows to stay well under limits
const BATCH_SIZE = 3;
const batches = [];
for (let i = 0; i < updates.length; i += BATCH_SIZE) {
  batches.push(updates.slice(i, i + BATCH_SIZE));
}

let fullScript = `/**
 * Blog Content Update Script
 * Generated on ${new Date().toISOString()}
 * Total updates: ${updates.length} rows
 *
 * HOW TO USE:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Paste this entire script
 * 4. Click Run > runAllBatches
 * 5. Authorize when prompted
 * 6. Wait for completion (check Execution Log)
 */

`;

// Generate each batch function
batches.forEach((batch, idx) => {
  const batchNum = idx + 1;
  fullScript += `function batch${batchNum}() {\n`;
  fullScript += `  var s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");\n`;

  for (const item of batch) {
    // Use template literal stored as regular string
    const escaped = JSON.stringify(item.content);
    fullScript += `  s.getRange(${item.sheetRow}, 23).setValue(${escaped});\n`;
  }

  fullScript += `  Logger.log("Batch ${batchNum}/${batches.length} done");\n`;
  fullScript += `}\n\n`;
});

// Master function
fullScript += `function runAllBatches() {\n`;
fullScript += `  var startTime = new Date();\n`;
for (let i = 1; i <= batches.length; i++) {
  fullScript += `  batch${i}();\n`;
  fullScript += `  SpreadsheetApp.flush();\n`;
  fullScript += `  Utilities.sleep(1000);\n`;
  fullScript += `  Logger.log("Progress: ${i}/${batches.length}");\n`;
}
fullScript += `  var elapsed = (new Date() - startTime) / 1000;\n`;
fullScript += `  Logger.log("All ${updates.length} blog rows updated in " + elapsed + "s");\n`;
fullScript += `}\n`;

const outFile = path.join(__dirname, 'UPDATE_BLOGS.gs');
fs.writeFileSync(outFile, fullScript);
const sizeKB = (fs.statSync(outFile).size / 1024).toFixed(1);
console.log(`Generated: ${outFile}`);
console.log(`Size: ${sizeKB}KB (${batches.length} batches of ${BATCH_SIZE})`);
console.log(`Total rows: ${updates.length}`);

if (parseFloat(sizeKB) > 500) {
  console.log('\n⚠️  File is large. You may need to paste batches separately.');
}
