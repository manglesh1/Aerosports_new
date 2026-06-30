const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const SPREADSHEET_ID = "1B_9EaTQDztWGH_cD3lUP7hpWD6FvNBJ-6Czml2x7d9c";
const CREDS_PATH = path.join(process.cwd(), "src", "app", "api", "sheet", "service-account-creds.json");

function colToLetter(col) {
  let letter = "";
  let c = col;
  while (c >= 0) {
    letter = String.fromCharCode((c % 26) + 65) + letter;
    c = Math.floor(c / 26) - 1;
  }
  return letter;
}

async function getSheets() {
  const creds = JSON.parse(fs.readFileSync(CREDS_PATH, "utf8"));
  const auth = new google.auth.JWT({
    email: creds.client_email,
    key: (creds.private_key || "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  await auth.authorize();
  return google.sheets({ version: "v4", auth });
}

async function getValues(sheets, range) {
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range });
  return res.data.values || [];
}

function objectRows(values) {
  const headers = values[0] || [];
  return values.slice(1).map((row, i) => {
    const obj = { _rowNumber: i + 2 };
    headers.forEach((h, idx) => (obj[h] = row[idx] || ""));
    return obj;
  });
}

function rowFromObject(headers, data) {
  return headers.map((h) => data[h] || "");
}

async function main() {
  const sheets = await getSheets();
  const values = await getValues(sheets, "'birthday'!A:Z");
  if (!values.length) throw new Error("birthday sheet is empty or missing");
  const headers = values[0];
  const rows = objectRows(values);
  console.log("birthday headers:", headers.join(" | "));

  const locationHeader = headers.includes("Location") ? "Location" : "location";
  const keyHeader = headers.includes("__EMPTY") ? "__EMPTY" : "";
  const required = [locationHeader, "section", keyHeader, "Premium Package"];
  const missing = required.filter((h) => !headers.includes(h));
  if (missing.length) throw new Error(`birthday sheet missing columns: ${missing.map((h) => h || "<blank key column>").join(", ")}`);

  const ctaRows = [
    ["eyebrow", "Birthday Parties"],
    ["heading", "The Birthday They'll Be Talking About All Year"],
    ["body", "From bouncing on trampolines to battling on beams and exploring our 7D Dark Ride - your guests get access to more attractions than any birthday venue in {locationName}, all at a price that actually makes sense."],
    ["urgency", "Weekday parties start at just $350. Spots fill fast."],
    ["video", ""],
    ["poster", ""],
    ["primary-label", "Book Before It's Gone"],
    ["primary-url", ""],
    ["secondary-label", "Compare Packages"],
    ["secondary-url", "#party-packages"],
  ].map(([key, value]) => ({
    [locationHeader]: "all",
    section: "birthday-media-cta",
    [keyHeader]: key,
    "Premium Package": value,
  }));

  const existing = new Map(
    rows
      .filter((row) => String(row.Location || row.location || "").toLowerCase().trim() === "all")
      .filter((row) => String(row.section || "").toLowerCase().trim() === "birthday-media-cta")
      .map((row) => [String(row.__EMPTY || row[""] || "").toLowerCase().trim(), row])
  );

  const updates = [];
  const appends = [];
  const lastCol = colToLetter(headers.length - 1);
  for (const row of ctaRows) {
    const key = String(row[keyHeader]).toLowerCase();
    const valuesRow = rowFromObject(headers, row);
    const found = existing.get(key);
    if (found) {
      updates.push({ range: `'birthday'!A${found._rowNumber}:${lastCol}${found._rowNumber}`, values: [valuesRow] });
    } else {
      appends.push(valuesRow);
    }
  }

  if (updates.length) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { valueInputOption: "RAW", data: updates },
    });
  }
  if (appends.length) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `'birthday'!A:${lastCol}`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: appends },
    });
  }
  console.log(`birthday-media-cta rows updated: ${updates.length}, appended: ${appends.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
