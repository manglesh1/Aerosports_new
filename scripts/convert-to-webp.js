#!/usr/bin/env node
/**
 * AeroSports Image → WebP Conversion Pipeline
 *
 * This script:
 * 1. Lists all images in the GCP 'aerosports' bucket
 * 2. Downloads them to a local folder
 * 3. Converts PNG/JPG/JPEG to WebP using sharp
 * 4. Uploads WebP versions to 'aerosports' bucket under webp/ folder
 * 5. Generates a mapping file (old URL → new URL) for sheet updates
 *
 * Prerequisites:
 *   npm install sharp @google-cloud/storage
 *
 * Usage:
 *   node scripts/convert-to-webp.js                # Full pipeline
 *   node scripts/convert-to-webp.js --download     # Download only
 *   node scripts/convert-to-webp.js --convert      # Convert only (after download)
 *   node scripts/convert-to-webp.js --upload        # Upload only (after convert)
 *   node scripts/convert-to-webp.js --map           # Generate mapping only
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// --- Configuration ---
const BUCKET = 'aerosports';
const GCS_API = `https://storage.googleapis.com/storage/v1/b/${BUCKET}/o`;
const GCS_DOWNLOAD = `https://storage.googleapis.com/${BUCKET}`;
const LOCAL_DIR = path.join(__dirname, '..', 'gcp-images-original');
const WEBP_DIR = path.join(__dirname, '..', 'gcp-images-webp');
const MAPPING_FILE = path.join(__dirname, '..', 'image-url-mapping.json');
const UPLOAD_FOLDER = 'webp'; // New folder in the bucket
const CONCURRENCY = 5; // Parallel downloads/uploads
const WEBP_QUALITY = 80; // WebP quality (1-100)

// Image extensions to convert (SVGs are kept as-is)
const CONVERTIBLE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.bmp'];
const SKIP_EXTS = ['.svg', '.ico', '.webp'];

// --- Helpers ---
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error: ${e.message}`)); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    fs.mkdirSync(dir, { recursive: true });

    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function runInBatches(items, concurrency, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(batch.map(fn));
    results.push(...batchResults);
    process.stdout.write(`\r  Progress: ${Math.min(i + concurrency, items.length)}/${items.length}`);
  }
  console.log('');
  return results;
}

// --- Step 1: List all images ---
async function listAllImages() {
  console.log('\n📋 Step 1: Listing all images in bucket...');
  let allImages = [];
  let pageToken = null;
  let page = 0;

  do {
    let url = `${GCS_API}?maxResults=1000&fields=items(name,size,contentType),nextPageToken`;
    if (pageToken) url += `&pageToken=${encodeURIComponent(pageToken)}`;

    const data = await fetchJson(url);
    const items = (data.items || []).filter(i =>
      /\.(png|jpg|jpeg|gif|svg|webp|bmp|ico)$/i.test(i.name)
    );
    allImages = allImages.concat(items);
    pageToken = data.nextPageToken;
    page++;
  } while (pageToken && page < 20);

  console.log(`  Found ${allImages.length} images`);

  const stats = { png: 0, jpg: 0, jpeg: 0, webp: 0, svg: 0, other: 0 };
  for (const img of allImages) {
    const ext = path.extname(img.name).toLowerCase().replace('.', '');
    stats[ext] = (stats[ext] || 0) + 1;
  }
  console.log(`  Breakdown: PNG=${stats.png}, JPG=${stats.jpg}, JPEG=${stats.jpeg}, WebP=${stats.webp}, SVG=${stats.svg}`);

  return allImages;
}

// --- Step 2: Download images ---
async function downloadImages(images) {
  console.log(`\n⬇️  Step 2: Downloading ${images.length} images to ${LOCAL_DIR}...`);
  fs.mkdirSync(LOCAL_DIR, { recursive: true });

  // Skip already downloaded
  const toDownload = images.filter(img => {
    const localPath = path.join(LOCAL_DIR, img.name);
    if (fs.existsSync(localPath)) {
      const stat = fs.statSync(localPath);
      if (stat.size > 0) return false; // Already downloaded
    }
    return true;
  });

  console.log(`  ${images.length - toDownload.length} already downloaded, ${toDownload.length} to download`);

  if (toDownload.length === 0) return;

  const results = await runInBatches(toDownload, CONCURRENCY, async (img) => {
    const url = `${GCS_DOWNLOAD}/${encodeURIComponent(img.name).replace(/%2F/g, '/')}`;
    const dest = path.join(LOCAL_DIR, img.name);
    await downloadFile(url, dest);
  });

  const failed = results.filter(r => r.status === 'rejected');
  if (failed.length > 0) {
    console.log(`  ⚠️  ${failed.length} downloads failed`);
    failed.slice(0, 5).forEach(f => console.log(`    - ${f.reason?.message}`));
  }
}

// --- Step 3: Convert to WebP ---
async function convertToWebp(images) {
  console.log(`\n🔄 Step 3: Converting images to WebP (quality=${WEBP_QUALITY})...`);

  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.error('  ❌ sharp not installed. Run: npm install sharp');
    process.exit(1);
  }

  fs.mkdirSync(WEBP_DIR, { recursive: true });

  const toConvert = images.filter(img => {
    const ext = path.extname(img.name).toLowerCase();
    if (SKIP_EXTS.includes(ext)) return false; // Skip SVG, ICO, already WebP

    const webpName = img.name.replace(/\.(png|jpg|jpeg|gif|bmp)$/i, '.webp');
    const webpPath = path.join(WEBP_DIR, webpName);
    if (fs.existsSync(webpPath)) return false; // Already converted

    const srcPath = path.join(LOCAL_DIR, img.name);
    if (!fs.existsSync(srcPath)) return false; // Source not downloaded

    return true;
  });

  // Also copy existing webp and svg files as-is
  const copyAsIs = images.filter(img => {
    const ext = path.extname(img.name).toLowerCase();
    return ext === '.webp' || ext === '.svg';
  });

  console.log(`  ${toConvert.length} to convert, ${copyAsIs.length} to copy as-is (WebP/SVG)`);

  // Copy existing WebP and SVG files
  for (const img of copyAsIs) {
    const srcPath = path.join(LOCAL_DIR, img.name);
    const destPath = path.join(WEBP_DIR, img.name);
    if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }

  // Convert images
  let converted = 0;
  let totalSaved = 0;

  const results = await runInBatches(toConvert, CONCURRENCY, async (img) => {
    const srcPath = path.join(LOCAL_DIR, img.name);
    const webpName = img.name.replace(/\.(png|jpg|jpeg|gif|bmp)$/i, '.webp');
    const destPath = path.join(WEBP_DIR, webpName);

    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    const srcSize = fs.statSync(srcPath).size;
    await sharp(srcPath)
      .webp({ quality: WEBP_QUALITY })
      .toFile(destPath);

    const destSize = fs.statSync(destPath).size;
    totalSaved += (srcSize - destSize);
    converted++;
  });

  const failed = results.filter(r => r.status === 'rejected');
  console.log(`  ✅ Converted: ${converted}, Failed: ${failed.length}`);
  console.log(`  💾 Space saved: ${(totalSaved / 1024 / 1024).toFixed(1)} MB`);

  if (failed.length > 0) {
    console.log(`  Failed files:`);
    failed.slice(0, 10).forEach(f => console.log(`    - ${f.reason?.message}`));
  }
}

// --- Step 4: Upload to GCP ---
async function uploadToGcp(images) {
  console.log(`\n⬆️  Step 4: Uploading WebP images to gs://${BUCKET}/${UPLOAD_FOLDER}/...`);

  let Storage;
  try {
    const gcs = require('@google-cloud/storage');
    Storage = gcs.Storage;
  } catch (e) {
    console.error('  ❌ @google-cloud/storage not installed. Run: npm install @google-cloud/storage');
    console.log('  Alternatively, use gsutil:');
    console.log(`    gsutil -m cp -r ${WEBP_DIR}/* gs://${BUCKET}/${UPLOAD_FOLDER}/`);
    return;
  }

  const storage = new Storage(); // Uses default credentials (GOOGLE_APPLICATION_CREDENTIALS)
  const bucket = storage.bucket(BUCKET);

  // Collect all files in WEBP_DIR
  function getFiles(dir, base = '') {
    const files = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const rel = base ? `${base}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        files.push(...getFiles(path.join(dir, entry.name), rel));
      } else {
        files.push(rel);
      }
    }
    return files;
  }

  const localFiles = getFiles(WEBP_DIR);
  console.log(`  ${localFiles.length} files to upload`);

  const results = await runInBatches(localFiles, CONCURRENCY, async (relPath) => {
    const localPath = path.join(WEBP_DIR, relPath);
    const gcsPath = `${UPLOAD_FOLDER}/${relPath}`;

    await bucket.upload(localPath, {
      destination: gcsPath,
      metadata: {
        cacheControl: 'public, max-age=31536000',
        contentType: relPath.endsWith('.webp') ? 'image/webp' :
                     relPath.endsWith('.svg') ? 'image/svg+xml' : 'application/octet-stream',
      },
    });
  });

  const failed = results.filter(r => r.status === 'rejected');
  console.log(`  ✅ Uploaded: ${localFiles.length - failed.length}, Failed: ${failed.length}`);
  if (failed.length > 0) {
    failed.slice(0, 5).forEach(f => console.log(`    - ${f.reason?.message}`));
  }
}

// --- Step 5: Generate URL mapping ---
async function generateMapping(images) {
  console.log(`\n📝 Step 5: Generating URL mapping file...`);

  const mapping = {};

  for (const img of images) {
    const ext = path.extname(img.name).toLowerCase();
    const oldUrl = `https://storage.googleapis.com/${BUCKET}/${img.name}`;

    if (CONVERTIBLE_EXTS.includes(ext)) {
      const webpName = img.name.replace(/\.(png|jpg|jpeg|gif|bmp)$/i, '.webp');
      const newUrl = `https://storage.googleapis.com/${BUCKET}/${UPLOAD_FOLDER}/${webpName}`;
      mapping[oldUrl] = newUrl;
    } else if (ext === '.svg' || ext === '.webp') {
      // SVG and existing WebP keep same name in new folder
      const newUrl = `https://storage.googleapis.com/${BUCKET}/${UPLOAD_FOLDER}/${img.name}`;
      mapping[oldUrl] = newUrl;
    }
  }

  fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
  console.log(`  ✅ Saved ${Object.keys(mapping).length} URL mappings to ${MAPPING_FILE}`);

  // Also generate a simple find-replace summary
  const summary = Object.entries(mapping).map(([old, neu]) => `${old}\n  → ${neu}`).join('\n\n');
  const summaryFile = path.join(__dirname, '..', 'image-url-mapping.txt');
  fs.writeFileSync(summaryFile, summary);
  console.log(`  📄 Human-readable mapping: ${summaryFile}`);
}

// --- Main ---
async function main() {
  const args = process.argv.slice(2);
  const doAll = args.length === 0;

  console.log('🚀 AeroSports Image → WebP Conversion Pipeline');
  console.log(`   Bucket: gs://${BUCKET}`);
  console.log(`   Download dir: ${LOCAL_DIR}`);
  console.log(`   WebP dir: ${WEBP_DIR}`);
  console.log(`   Upload to: gs://${BUCKET}/${UPLOAD_FOLDER}/`);

  // Always list images first
  const images = await listAllImages();

  if (doAll || args.includes('--download')) {
    await downloadImages(images);
  }

  if (doAll || args.includes('--convert')) {
    await convertToWebp(images);
  }

  if (doAll || args.includes('--upload')) {
    await uploadToGcp(images);
  }

  if (doAll || args.includes('--map')) {
    await generateMapping(images);
  }

  console.log('\n✨ Done!');
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
