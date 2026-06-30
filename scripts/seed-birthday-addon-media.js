const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const SPREADSHEET_ID = "1B_9EaTQDztWGH_cD3lUP7hpWD6FvNBJ-6Czml2x7d9c";
const CREDS_PATH = path.join(process.cwd(), "src", "app", "api", "sheet", "service-account-creds.json");

const ASSET_BASE = "/assets/images/birthday-addons";
const MEDIA_ROWS = [
  ["media_005", "image", `${ASSET_BASE}/pizza.svg`, `${ASSET_BASE}/pizza.svg`, "Birthday pizza add-on", "Large Pizza"],
  ["media_006", "image", `${ASSET_BASE}/pizza.svg`, `${ASSET_BASE}/pizza.svg`, "Gluten free pizza add-on", "Gluten Free Pizza"],
  ["media_007", "image", `${ASSET_BASE}/wings.svg`, `${ASSET_BASE}/wings.svg`, "Chicken wings add-on", "Chicken Wings"],
  ["media_008", "image", `${ASSET_BASE}/snacks.svg`, `${ASSET_BASE}/snacks.svg`, "Potato wedges add-on", "Potato Wedges"],
  ["media_009", "image", `${ASSET_BASE}/snacks.svg`, `${ASSET_BASE}/snacks.svg`, "Chicken nuggets add-on", "Chicken Nuggets"],
  ["media_010", "image", `${ASSET_BASE}/snacks.svg`, `${ASSET_BASE}/snacks.svg`, "Chicken nuggets add-on", "Chicken Nuggets"],
  ["media_011", "image", `${ASSET_BASE}/dippin-dots.svg`, `${ASSET_BASE}/dippin-dots.svg`, "Party donuts add-on", "Party Donuts"],
  ["media_012", "image", `${ASSET_BASE}/snacks.svg`, `${ASSET_BASE}/snacks.svg`, "Bowl of chips add-on", "Bowl of Chips"],
  ["media_013", "image", `${ASSET_BASE}/popcorn.svg`, `${ASSET_BASE}/popcorn.svg`, "Bowl of popcorn add-on", "Bowl of Popcorn"],
  ["media_014", "image", `${ASSET_BASE}/drink.svg`, `${ASSET_BASE}/drink.svg`, "Juice boxes add-on", "Juice Boxes"],
  ["media_015", "image", `${ASSET_BASE}/loot-bag.svg`, `${ASSET_BASE}/loot-bag.svg`, "Loot bags add-on", "Loot Bags"],
  ["media_016", "image", `${ASSET_BASE}/drink.svg`, `${ASSET_BASE}/drink.svg`, "Pitcher of pop add-on", "Pitcher of Pop"],
  ["media_017", "image", `${ASSET_BASE}/invitation.svg`, `${ASSET_BASE}/invitation.svg`, "Birthday invitations add-on", "Birthday Invitations"],
  ["media_019", "image", `${ASSET_BASE}/snacks.svg`, `${ASSET_BASE}/snacks.svg`, "Bowl of chips add-on", "Bowl of Chips"],
  ["media_020", "image", `${ASSET_BASE}/snacks.svg`, `${ASSET_BASE}/snacks.svg`, "Bowl of chips add-on", "Bowl of Chips"],
  ["media_021", "image", `${ASSET_BASE}/dippin-dots.svg`, `${ASSET_BASE}/dippin-dots.svg`, "Dippin Dots add-on", "Dippin Dots"],
  ["media_022", "image", `${ASSET_BASE}/dippin-dots.svg`, `${ASSET_BASE}/dippin-dots.svg`, "Dippin Dots add-on", "Dippin Dots"],
  ["media_023", "image", `${ASSET_BASE}/popcorn.svg`, `${ASSET_BASE}/popcorn.svg`, "Bowl of popcorn add-on", "Bowl of Popcorn"],
  ["media_024", "image", `${ASSET_BASE}/popcorn.svg`, `${ASSET_BASE}/popcorn.svg`, "Bowl of popcorn add-on", "Bowl of Popcorn"],
  ["media_025", "image", `${ASSET_BASE}/pizza.svg`, `${ASSET_BASE}/pizza.svg`, "Birthday pizza add-on", "Birthday Pizza"],
  ["media_026", "image", `${ASSET_BASE}/drink.svg`, `${ASSET_BASE}/drink.svg`, "Pitcher of pop add-on", "Pitcher of Pop"],
  ["media_027", "image", `${ASSET_BASE}/drink.svg`, `${ASSET_BASE}/drink.svg`, "Pitcher of pop add-on", "Pitcher of Pop"],
  ["media_028", "image", `${ASSET_BASE}/dippin-dots.svg`, `${ASSET_BASE}/dippin-dots.svg`, "Ice cream sundae bar add-on", "Ice Cream Sundae Bar"],
];

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

async function main() {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "'media'!A:Z",
  });
  const values = res.data.values || [];
  const headers = values[0] || [];
  if (!headers.length) throw new Error("media sheet is empty or missing");

  const idIndex = headers.indexOf("id");
  if (idIndex === -1) throw new Error("media sheet is missing id column");

  const existingById = new Map();
  values.slice(1).forEach((row, index) => {
    const id = String(row[idIndex] || "").trim();
    if (id) existingById.set(id, index + 2);
  });

  const rowFor = ([id, type, desktopUrl, mobileUrl, alt, title]) =>
    headers.map((header) => {
      const key = String(header || "").trim();
      if (key === "id") return id;
      if (key === "type") return type;
      if (key === "desktop_url") return desktopUrl;
      if (key === "mobile_url") return mobileUrl;
      if (key === "alt") return alt;
      if (key === "title") return title;
      if (key === "location") return "all";
      return "";
    });

  const lastCol = colToLetter(headers.length - 1);
  const updates = [];
  const appends = [];

  MEDIA_ROWS.forEach((mediaRow) => {
    const id = mediaRow[0];
    const valuesRow = rowFor(mediaRow);
    const existingRow = existingById.get(id);
    if (existingRow) {
      updates.push({ range: `'media'!A${existingRow}:${lastCol}${existingRow}`, values: [valuesRow] });
    } else {
      appends.push(valuesRow);
    }
  });

  if (updates.length) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { valueInputOption: "RAW", data: updates },
    });
  }

  if (appends.length) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `'media'!A:${lastCol}`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: appends },
    });
  }

  console.log(`birthday add-on media seeded: ${updates.length} updated, ${appends.length} appended`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
