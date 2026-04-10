/**
 * Reads the Data sheet, finds attraction rows, and adds audience + priority
 * columns for all locations. Uses actual paths from the sheet.
 *
 * Usage: node scripts/update-attractions-sheet.js
 */
const { google } = require("googleapis");
const path = require("path");

const SPREADSHEET_ID = "1B_9EaTQDztWGH_cD3lUP7hpWD6FvNBJ-6Czml2x7d9c";
const SHEET_NAME = "Data";
const CREDS_PATH = path.join(__dirname, "..", "src", "app", "api", "sheet", "service-account-creds.json");

// Default audience/priority mapped to ACTUAL paths in the sheet.
// These get written only if the cell is currently blank.
const DEFAULTS = {
  "open-jump":              { audience: "All Ages",       priority: 1 },
  "dodgeball":              { audience: "Teens & Groups", priority: 2 },
  "ninja-warrior":          { audience: "Kids & Teens",   priority: 3 },
  "battle-beam":            { audience: "All Ages",       priority: 4 },
  "slam-basketball":        { audience: "Kids & Teens",   priority: 5 },
  "soft-play":              { audience: "Ages 2-5",       priority: 6 },
  "dark-ride-theater":      { audience: "All Ages",       priority: 7 },
  "hexaquest":              { audience: "All Ages",       priority: 8 },
  "tile-hunt":              { audience: "Kids & Teens",   priority: 9 },
  "aero-ladder":            { audience: "All Ages",       priority: 10 },
  "aero-drop":              { audience: "All Ages",       priority: 11 },
  "wipeout":                { audience: "All Ages",       priority: 9 },
  "arcade":                 { audience: "All Ages",       priority: 13 },
  "full-arcade":            { audience: "All Ages",       priority: 13 },
  "climbing-walls":         { audience: "All Ages",       priority: 8 },
  "climb-slide":            { audience: "Kids & Teens",   priority: 8 },
  "valo-arena":             { audience: "Teens & Adults", priority: 7 },
  "valo-jump":              { audience: "All Ages",       priority: 7 },
  "interactive-floor":      { audience: "All Ages",       priority: 12 },
  "warped-walls":           { audience: "Teens & Adults", priority: 6 },
  "ninjatag":               { audience: "Teens & Groups", priority: 3 },
  "axe-throw":              { audience: "Teens & Adults", priority: 14 },
  "golf-glow-dark-mini-putt": { audience: "All Ages",    priority: 12 },
  "archery":                { audience: "Teens & Adults", priority: 14 },
  "aero-hoops":             { audience: "All Ages",       priority: 5 },
  "rock-wall":              { audience: "All Ages",       priority: 8 },
  "go-kart":                { audience: "Kids & Teens",   priority: 2 },
  "360-bike":               { audience: "All Ages",       priority: 9 },
  "donut-slide":            { audience: "All Ages",       priority: 10 },
  "bazooka-ball":           { audience: "Teens & Groups", priority: 4 },
  "laser-tag":              { audience: "All Ages",       priority: 3 },
  "mini-golf":              { audience: "All Ages",       priority: 12 },
};

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDS_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  // 1. Read the entire Data sheet
  console.log("Reading Data sheet...");
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}`,
  });

  const rows = res.data.values;
  if (!rows || rows.length === 0) { console.log("No data found."); return; }

  const headers = rows[0];
  console.log(`Found ${rows.length - 1} data rows, ${headers.length} columns`);

  let audienceCol = headers.indexOf("audience");
  let priorityCol = headers.indexOf("priority");
  const pathCol = headers.indexOf("path");
  const parentCol = headers.indexOf("parentid");
  const locationCol = headers.indexOf("location");

  // 2. If columns don't exist, expand sheet and add headers
  if (audienceCol === -1 || priorityCol === -1) {
    // Get sheet metadata to find sheetId and current column count
    const meta = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      fields: "sheets(properties(sheetId,title,gridProperties))",
    });
    const sheetMeta = meta.data.sheets.find(s => s.properties.title === SHEET_NAME);
    const sheetId = sheetMeta.properties.sheetId;
    const currentCols = sheetMeta.properties.gridProperties.columnCount;
    const colsNeeded = (audienceCol === -1 ? 1 : 0) + (priorityCol === -1 ? 1 : 0);

    if (currentCols < headers.length + colsNeeded) {
      console.log(`Expanding sheet from ${currentCols} to ${currentCols + colsNeeded} columns...`);
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            appendDimension: {
              sheetId,
              dimension: "COLUMNS",
              length: colsNeeded,
            },
          }],
        },
      });
    }

    // Add headers
    const headerUpdates = [];
    if (audienceCol === -1) {
      audienceCol = headers.length;
      headerUpdates.push({ range: `${SHEET_NAME}!${colToLetter(audienceCol)}1`, values: [["audience"]] });
      headers.push("audience");
      console.log(`Adding "audience" header at column ${colToLetter(audienceCol)}`);
    }
    if (priorityCol === -1) {
      priorityCol = headers.length;
      headerUpdates.push({ range: `${SHEET_NAME}!${colToLetter(priorityCol)}1`, values: [["priority"]] });
      headers.push("priority");
      console.log(`Adding "priority" header at column ${colToLetter(priorityCol)}`);
    }
    if (headerUpdates.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: { valueInputOption: "RAW", data: headerUpdates },
      });
    }
  }

  console.log(`\nColumn indices: path=${pathCol}, parentid=${parentCol}, location=${locationCol}, audience=${audienceCol}(${colToLetter(audienceCol)}), priority=${priorityCol}(${colToLetter(priorityCol)})`);

  // 3. Find attraction rows and prepare updates
  const updates = [];
  let matchCount = 0;
  let skipCount = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowPath = (row[pathCol] || "").toString().trim();
    const rowParent = parentCol >= 0 ? (row[parentCol] || "").toString().trim().toLowerCase() : "";
    const rowLocation = locationCol >= 0 ? (row[locationCol] || "").toString().trim() : "";

    if (rowParent !== "attractions") continue;

    const defaults = DEFAULTS[rowPath] || null;
    const currentAudience = (row[audienceCol] || "").toString().trim();
    const currentPriority = (row[priorityCol] || "").toString().trim();
    const rowNum = i + 1;

    if (!defaults) {
      console.log(`  Row ${rowNum}: ${rowLocation}/${rowPath} → no defaults, skipping`);
      skipCount++;
      continue;
    }

    let updated = false;
    if (!currentAudience && defaults.audience) {
      updates.push({ range: `${SHEET_NAME}!${colToLetter(audienceCol)}${rowNum}`, values: [[defaults.audience]] });
      updated = true;
    }
    if (!currentPriority && defaults.priority) {
      updates.push({ range: `${SHEET_NAME}!${colToLetter(priorityCol)}${rowNum}`, values: [[defaults.priority]] });
      updated = true;
    }

    const status = updated ? "✅ WRITING" : "(already has values)";
    console.log(`  Row ${rowNum}: ${rowLocation}/${rowPath} → audience="${defaults.audience}", priority=${defaults.priority} ${status}`);
    matchCount++;
  }

  console.log(`\n${matchCount} matched, ${skipCount} skipped (no defaults), ${updates.length} cells to write`);

  // 4. Write all updates
  if (updates.length > 0) {
    console.log("\nWriting to sheet...");
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { valueInputOption: "RAW", data: updates },
    });
    console.log(`✅ Done! ${updates.length} cells updated in Google Sheet.`);
  } else {
    console.log("Nothing to update.");
  }
}

function colToLetter(col) {
  let letter = "";
  let c = col;
  while (c >= 0) {
    letter = String.fromCharCode((c % 26) + 65) + letter;
    c = Math.floor(c / 26) - 1;
  }
  return letter;
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  if (err.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
  process.exit(1);
});
