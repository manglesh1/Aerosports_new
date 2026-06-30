const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const sharp = require("sharp");
const { google } = require("googleapis");

const SPREADSHEET_ID = "1B_9EaTQDztWGH_cD3lUP7hpWD6FvNBJ-6Czml2x7d9c";
const CREDS_PATH = path.join(process.cwd(), "src", "app", "api", "sheet", "service-account-creds.json");
const OUT_DIR = "C:\\tmp\\aerosports-stc-attractions";
const BUCKET_PREFIX = "gs://media.aerosportsparks.ca/webp/st-catharines/attractions";
const CDN_PREFIX = "https://media.aerosportsparks.ca/webp/st-catharines/attractions";
const CLEAN_SUFFIX = "clean";

const files = [
  { path: "C:\\Users\\mn\\Downloads\\open jump.jpg", slug: "open-jump-new-pads-flip", attraction: "open-jump", group: "Open Jump", main: false, title: "Open Jump New Pads" },
  { path: "C:\\Users\\mn\\Downloads\\jump.jpg", slug: "open-jump-new-pads", attraction: "open-jump", group: "Open Jump", main: true, title: "Open Jump New Pads" },
  { path: "C:\\Users\\mn\\Downloads\\dodgeball.jpg", slug: "dodgeball-new-pads", attraction: "dodgeball", group: "Dodgeball", main: true, title: "Dodgeball" },
  { path: "C:\\Users\\mn\\Downloads\\foam-pit.jpg", slug: "foam-pit-new-pads", attraction: "open-jump", group: "Foam Pit", main: false, title: "Foam Pit" },
  { path: "C:\\Users\\mn\\Downloads\\foam-pit12.jpg", slug: "foam-pit-new-pads-2", attraction: "open-jump", group: "Foam Pit", main: false, title: "Foam Pit" },
  { path: "C:\\Users\\mn\\Downloads\\laser-shooting.JPG", slug: "laser-shooting", attraction: "laser-shooting", group: "Laser Shooting", main: true, title: "Laser Shooting" },
  { path: "C:\\Users\\mn\\Downloads\\climb.JPG", slug: "climb", attraction: "climb", group: "Climb", main: true, title: "Climb" },
  { path: "C:\\Users\\mn\\Downloads\\basketball.JPG", slug: "basketball-hoops", attraction: "hoops", alsoAttractions: ["aero-hoops"], group: "Hoops", main: true, title: "Hoops" },
  { path: "C:\\Users\\mn\\Downloads\\pushgame.JPG", slug: "push-game", attraction: "push-game", group: "Push Game", main: true, title: "Push Game" },

  { path: "C:\\Users\\mn\\Downloads\\battle  beam.JPG", slug: "battle-beam", attraction: "battle-beam", group: "Battle Beam", main: true, title: "Battle Beam" },
  { path: "C:\\Users\\mn\\Downloads\\battle beam2.JPG", slug: "battle-beam-2", attraction: "battle-beam", group: "Battle Beam", main: false, title: "Battle Beam" },
  { path: "C:\\Users\\mn\\Downloads\\aero slam.JPG", slug: "aero-slam", attraction: "slam-basketball", group: "Aero Slam", main: false, title: "Aero Slam" },
  { path: "C:\\Users\\mn\\Downloads\\ninja-tag.jpg", slug: "ninja-tag", attraction: "ninjatag", group: "Ninja Tag", main: true, title: "Ninja Tag" },
  { path: "C:\\Users\\mn\\Downloads\\ninja warrior.jpg", slug: "ninja-warrior", attraction: "ninja-warrior", group: "Ninja Warrior", main: true, title: "Ninja Warrior" },
  { path: "C:\\Users\\mn\\Downloads\\ninja-warrior.jpg", slug: "ninja-warrior-2", attraction: "ninja-warrior", group: "Ninja Warrior", main: false, title: "Ninja Warrior" },
  { path: "C:\\Users\\mn\\Downloads\\open-jump-9.jpg", slug: "open-jump-9", attraction: "open-jump", group: "Open Jump", main: false, title: "Open Jump" },
  { path: "C:\\Users\\mn\\Downloads\\open-jump-13.jpg", slug: "open-jump-13", attraction: "open-jump", group: "Open Jump", main: false, title: "Open Jump" },
  { path: "C:\\Users\\mn\\Downloads\\open-jump-15.jpg", slug: "open-jump-15", attraction: "open-jump", group: "Open Jump", main: false, title: "Open Jump" },
  { path: "C:\\Users\\mn\\Downloads\\groups.jpg", slug: "open-jump-groups", attraction: "open-jump", group: "Open Jump", main: false, title: "Open Jump" },
  { path: "C:\\Users\\mn\\Downloads\\ball-pit.jpg", slug: "ball-pit", attraction: "", group: "Ball Pit", main: false, title: "Ball Pit" },
  { path: "C:\\Users\\mn\\Downloads\\foam-pit-2.jpg", slug: "foam-pit", attraction: "open-jump", group: "Foam Pit", main: false, title: "Foam Pit" },
  { path: "C:\\Users\\mn\\Downloads\\hexa-quest-3.jpg", slug: "hexa-quest", attraction: "hexaquest", group: "Hexa Quest", main: true, title: "Hexa Quest" },
  { path: "C:\\Users\\mn\\Downloads\\archery-2.jpg", slug: "archery", attraction: "archery", group: "Archery", main: true, title: "Archery" },
].filter((item) => fs.existsSync(item.path));

function colToLetter(col) {
  let letter = "";
  let c = col;
  while (c >= 0) {
    letter = String.fromCharCode((c % 26) + 65) + letter;
    c = Math.floor(c / 26) - 1;
  }
  return letter;
}

function q(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

async function optimizeAndUpload(item) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const uploadedSlug = `${item.slug}-${CLEAN_SUFFIX}`;
  const out = path.join(OUT_DIR, `${uploadedSlug}.webp`);
  const image = sharp(item.path).rotate();
  const metadata = await image.metadata();

  // Conservative photo-cleaning pass: denoise, balance contrast, lift shadows slightly,
  // and sharpen without inventing details or changing faces/equipment.
  await image
    .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
    .median(1)
    .normalise({ lower: 1, upper: 99 })
    .modulate({ brightness: 1.05, saturation: 1.06 })
    .sharpen({ sigma: 0.9 })
    .webp({ quality: 84, effort: 5 })
    .toFile(out);

  execSync(
    [
      "gcloud",
      "storage",
      "cp",
      q(out),
      q(`${BUCKET_PREFIX}/${uploadedSlug}.webp`),
      "--cache-control=public,max-age=31536000,immutable",
      "--content-type=image/webp",
    ].join(" "),
    { stdio: "inherit" }
  );

  const optimized = await sharp(out).metadata();
  return {
    ...item,
    uploadedSlug,
    oldUrl: `${CDN_PREFIX}/${item.slug}.webp`,
    sourceWidth: metadata.width || "",
    sourceHeight: metadata.height || "",
    width: optimized.width || "",
    height: optimized.height || "",
    url: `${CDN_PREFIX}/${uploadedSlug}.webp`,
    mediaId: `stc_attraction_${uploadedSlug.replace(/-/g, "_")}`,
  };
}

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDS_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
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
    headers.forEach((h, j) => { obj[h] = row[j] || ""; });
    return obj;
  });
}

async function upsertMediaRows(sheets, uploaded) {
  const values = await getValues(sheets, "'media'!A:I");
  const headers = values[0];
  const idCol = headers.indexOf("id");
  const rows = objectRows(values);
  const byId = new Map(rows.map((r) => [String(r.id || "").trim(), r]));
  const updates = [];
  const appends = [];

  for (const item of uploaded) {
    const row = {
      id: item.mediaId,
      type: "image",
      desktop_url: item.url,
      mobile_url: item.url,
      alt: `${item.title} at AeroSports St. Catharines`,
      title: `${item.title} - St. Catharines`,
      width: item.width,
      height: item.height,
      location: "st-catharines",
    };
    const valuesRow = headers.map((h) => row[h] ?? "");
    const existing = byId.get(item.mediaId);
    if (existing) {
      updates.push({ range: `'media'!A${existing._rowNumber}:${colToLetter(headers.length - 1)}${existing._rowNumber}`, values: [valuesRow] });
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
      range: "'media'!A:I",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: appends },
    });
  }
  console.log(`Media rows updated: ${updates.length}, appended: ${appends.length}`);
  if (idCol < 0) throw new Error("media sheet is missing id column");
}

async function updateDataAttractionImages(sheets, uploaded) {
  const values = await getValues(sheets, "'Data'!A:U");
  const headers = values[0];
  const rows = objectRows(values);
  const ix = Object.fromEntries(headers.map((h, i) => [h, i]));
  const updates = [];
  const mainByPath = new Map();

  for (const item of uploaded) {
    if (!item.main || !item.attraction) continue;
    for (const pathValue of [item.attraction, ...(item.alsoAttractions || [])]) {
      mainByPath.set(pathValue, item.mediaId);
    }
  }

  for (const row of rows) {
    if (String(row.location || "").toLowerCase() !== "st-catharines") continue;
    const mediaId = mainByPath.get(String(row.path || "").trim());
    if (!mediaId) continue;
    const rowNum = row._rowNumber;
    updates.push({ range: `'Data'!${colToLetter(ix.smallimage)}${rowNum}`, values: [[mediaId]] });
    updates.push({ range: `'Data'!${colToLetter(ix.headerimage)}${rowNum}`, values: [[mediaId]] });
  }

  if (updates.length) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { valueInputOption: "RAW", data: updates },
    });
  }
  console.log(`Data attraction image cells updated: ${updates.length}`);
}

async function appendGalleryRows(sheets, uploaded) {
  const values = await getValues(sheets, "'photo gallery'!A:F");
  const rows = objectRows(values);
  const seen = new Set(rows.map((r) => `${r.location}|${r.navbar}|${r.group}|${String(r.urls || "").trim()}`));
  const updates = [];
  const appends = [];

  for (const item of uploaded) {
    const existingOld = rows.find((r) =>
      r.location === "st-catharines" &&
      r.navbar === "gallery" &&
      r.group === item.group &&
      String(r.urls || "").trim() === item.oldUrl
    );

    const row = [
      "st-catharines",
      "gallery",
      item.group,
      item.url,
      `${item.title} - St. Catharines`,
      `${item.title} photo at AeroSports St. Catharines`,
    ];

    if (existingOld) {
      updates.push({ range: `'photo gallery'!A${existingOld._rowNumber}:F${existingOld._rowNumber}`, values: [row] });
      seen.add(row.slice(0, 4).join("|"));
      continue;
    }

    const key = row.slice(0, 4).join("|");
    if (!seen.has(key)) appends.push(row);
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
      range: "'photo gallery'!A:F",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: appends },
    });
  }
  console.log(`Photo gallery rows updated: ${updates.length}, appended: ${appends.length}`);
}

async function main() {
  if (!files.length) throw new Error("No source files found.");
  console.log(`Preparing ${files.length} St. Catharines attraction images...`);
  const uploaded = [];
  for (const item of files) {
    console.log(`\n${item.slug}`);
    uploaded.push(await optimizeAndUpload(item));
  }

  const sheets = await getSheets();
  await upsertMediaRows(sheets, uploaded);
  await updateDataAttractionImages(sheets, uploaded);
  await appendGalleryRows(sheets, uploaded);
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
