/**
 * Apply blog content directly to Google Sheet
 * Uses google-spreadsheet + service account auth directly
 */

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const mammoth = require('mammoth');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const SPREADSHEET_ID = '1m4sAEfIJUaIdnsKYBJeMe0FeESEtGU9ISRqJ_O9TFmo';
const creds = require('../src/app/api/sheet/service-account-creds.json');
const SHEET_FILE = path.join(__dirname, '..', 'aerosports_data.xlsx');
const BLOG_DIR = 'C:/Users/mn/Downloads/blogs';

const DRY_RUN = process.argv.includes('--dry-run');

const serviceAccountAuth = new JWT({
  email: creds.client_email,
  key: creds.private_key.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

function normalize(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

function cleanBlogHtml(html) {
  let cleaned = html;

  // Remove base64 embedded images (mammoth converts docx images to data URIs)
  cleaned = cleaned.replace(/<img[^>]*src="data:[^"]*"[^>]*\/?>/g, '');

  // Remove Google Docs anchor tags (empty <a id="..."></a>)
  cleaned = cleaned.replace(/<a\s+id="[^"]*"><\/a>/g, '');

  // Remove empty headings
  cleaned = cleaned.replace(/<h[1-6]>\s*<\/h[1-6]>/g, '');

  // Remove empty paragraphs
  cleaned = cleaned.replace(/<p>\s*<\/p>/g, '');

  // Clean up multiple whitespace
  cleaned = cleaned.replace(/\s{2,}/g, ' ');

  return cleaned.trim();
}

async function extractDocxData(filePath) {
  const result = await mammoth.convertToHtml({ path: filePath });
  const html = result.value;
  const tableMatch = html.match(/<table>([\s\S]*?)<\/table>/);
  if (!tableMatch) return null;

  const rows = tableMatch[1].match(/<tr>([\s\S]*?)<\/tr>/g) || [];
  const metadata = {};
  for (const row of rows) {
    const cells = row.match(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g) || [];
    if (cells.length >= 2) {
      const key = cells[0].replace(/<[^>]*>/g, '').trim();
      const value = cells[1].replace(/<[^>]*>/g, '').trim();
      metadata[key] = value;
    }
  }

  const content = html.split('</table>').slice(1).join('');
  return {
    topic: metadata['Topic'] || '',
    content: cleanBlogHtml(content),
    contentLength: content.replace(/<[^>]*>/g, '').trim().length,
  };
}

async function main() {
  console.log(`\n📝 Apply Blog Content to Google Sheet`);
  console.log(`Mode: ${DRY_RUN ? '🔍 DRY RUN' : '🚀 LIVE'}\n`);

  // ── Read local sheet data ──
  const wb = XLSX.readFile(SHEET_FILE);
  const ws = wb.Sheets['Data'];
  const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
  const blogs = data.map((row, index) => ({ ...row, _rowIndex: index })).filter(r => r.parentid === 'blogs');
  const missingBlogs = blogs.filter(b => !b.section1 || b.section1.trim().length < 50);

  console.log(`Total blogs: ${blogs.length}, Missing content: ${missingBlogs.length}\n`);

  // ── Read all docx files ──
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.docx'));
  const docxData = [];
  for (const file of files) {
    try {
      const extracted = await extractDocxData(path.join(BLOG_DIR, file));
      if (extracted && extracted.content.length > 100) {
        docxData.push({ ...extracted, file });
      }
    } catch (e) { /* skip */ }
  }

  // ── Match by title ──
  const updates = [];
  const usedDocs = new Set();

  for (const blog of missingBlogs) {
    const blogTitleNorm = normalize(blog.title);
    let bestMatch = null;
    let bestScore = 0;

    for (let i = 0; i < docxData.length; i++) {
      if (usedDocs.has(i)) continue;
      const docTopicNorm = normalize(docxData[i].topic);

      if (docTopicNorm === blogTitleNorm) { bestMatch = i; bestScore = 1.0; break; }

      const blogWords = new Set(blogTitleNorm.split(' ').filter(w => w.length > 2));
      const docWords = new Set(docTopicNorm.split(' ').filter(w => w.length > 2));
      const intersection = [...blogWords].filter(w => docWords.has(w));
      const score = intersection.length / Math.max(blogWords.size, 1);
      if (score > bestScore && score >= 0.6) { bestMatch = i; bestScore = score; }
    }

    if (bestMatch !== null) {
      usedDocs.add(bestMatch);
      updates.push({
        rowIndex: blog._rowIndex,
        path: blog.path,
        location: blog.location,
        title: blog.title,
        content: docxData[bestMatch].content,
        source: 'docx-match',
        score: bestScore,
      });
    }
  }

  console.log(`✅ Matched ${updates.length} blogs from docx files\n`);

  // ── Handle unmatched: location variants ──
  const matchedRows = new Set(updates.map(u => u.rowIndex));
  const stillMissing = missingBlogs.filter(b => !matchedRows.has(b._rowIndex));

  // For each missing blog, check if another location has the same path with content
  for (const blog of stillMissing) {
    // Check in updates we just built
    const samePathUpdate = updates.find(u => u.path === blog.path && u.rowIndex !== blog._rowIndex);
    if (samePathUpdate) {
      // Reword for this location
      const reworded = rewordForLocation(samePathUpdate.content, samePathUpdate.location, blog.location);
      updates.push({
        rowIndex: blog._rowIndex,
        path: blog.path,
        location: blog.location,
        title: blog.title,
        content: reworded,
        source: 'reworded-from-' + samePathUpdate.location,
      });
      continue;
    }

    // Check in existing sheet data (blogs that already have content)
    const existingBlog = blogs.find(b => b.path === blog.path && b.section1 && b.section1.trim().length > 50);
    if (existingBlog) {
      const reworded = rewordForLocation(existingBlog.section1, existingBlog.location, blog.location);
      updates.push({
        rowIndex: blog._rowIndex,
        path: blog.path,
        location: blog.location,
        title: blog.title,
        content: reworded,
        source: 'reworded-from-existing-' + existingBlog.location,
      });
    }
  }

  // ── Check what's still missing ──
  const allHandledRows = new Set(updates.map(u => u.rowIndex));
  let fullyMissing = missingBlogs.filter(b => !allHandledRows.has(b._rowIndex));

  // ── Load AI-generated content for remaining blogs ──
  const aiFile = path.join(__dirname, 'ai-generated-blogs.json');
  if (fs.existsSync(aiFile)) {
    const aiBlogs = JSON.parse(fs.readFileSync(aiFile, 'utf-8'));
    const handledByAi = new Set();
    for (const aiBlog of aiBlogs) {
      const missing = fullyMissing.find(b => b._rowIndex === aiBlog.rowIndex);
      if (missing) {
        updates.push({
          rowIndex: aiBlog.rowIndex,
          path: aiBlog.path,
          location: aiBlog.location,
          title: aiBlog.title,
          content: aiBlog.content,
          source: 'ai-generated',
        });
        handledByAi.add(aiBlog.rowIndex);
      }
    }
    // Remove AI-handled from fullyMissing
    fullyMissing = fullyMissing.filter(b => !handledByAi.has(b._rowIndex));
    console.log(`🤖 Added ${handledByAi.size} AI-generated blog posts`);
  }

  if (fullyMissing.length > 0) {
    console.log(`\n⚠️  ${fullyMissing.length} blogs still need content:`);
    fullyMissing.forEach(b => console.log(`  - ${b.location}/${b.path}: ${b.title.substring(0, 80)}`));
  }

  console.log(`\n📊 Total updates ready: ${updates.length}`);
  console.log(`   - From docx: ${updates.filter(u => u.source === 'docx-match').length}`);
  console.log(`   - Reworded variants: ${updates.filter(u => u.source.startsWith('reworded')).length}`);
  console.log(`   - Still missing: ${fullyMissing.length}\n`);

  if (DRY_RUN) {
    updates.forEach(u => console.log(`  [${u.source}] Row ${u.rowIndex}: ${u.location}/${u.path} (${u.content.length} chars)`));
    console.log('\nDry run complete. Run without --dry-run to apply.\n');

    // Save missing list for AI generation
    if (fullyMissing.length > 0) {
      const missingFile = path.join(__dirname, 'fully-missing-blogs.json');
      fs.writeFileSync(missingFile, JSON.stringify(fullyMissing.map(b => ({
        rowIndex: b._rowIndex, path: b.path, location: b.location, title: b.title,
      })), null, 2));
      console.log(`📄 Missing blogs list saved to: ${missingFile}\n`);
    }
    return;
  }

  // ── Apply to Google Sheet ──
  console.log('🔄 Connecting to Google Sheet...\n');
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Data'];
  await sheet.loadHeaderRow();
  const rows = await sheet.getRows();

  let successCount = 0;
  let failCount = 0;

  for (const update of updates) {
    try {
      const row = rows[update.rowIndex];
      if (!row) {
        console.log(`  ❌ Row ${update.rowIndex} not found`);
        failCount++;
        continue;
      }
      row.set('section1', update.content);
      await row.save();
      successCount++;
      console.log(`  ✅ Row ${update.rowIndex} — ${update.location}/${update.path} [${update.source}]`);

      // Rate limit
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      failCount++;
      console.log(`  ❌ Row ${update.rowIndex}: ${err.message}`);
    }
  }

  console.log(`\n✅ Done: ${successCount} updated, ${failCount} failed`);

  if (fullyMissing.length > 0) {
    const missingFile = path.join(__dirname, 'fully-missing-blogs.json');
    fs.writeFileSync(missingFile, JSON.stringify(fullyMissing.map(b => ({
      rowIndex: b._rowIndex, path: b.path, location: b.location, title: b.title,
    })), null, 2));
    console.log(`\n📄 ${fullyMissing.length} blogs still need AI content → ${missingFile}\n`);
  }
}

// ── Location reword utility ──
function rewordForLocation(html, fromLocation, toLocation) {
  const locationNames = {
    'oakville': 'Oakville',
    'london': 'London',
    'windsor': 'Windsor',
    'st-catharines': 'St. Catharines',
    'scarborough': 'Scarborough',
  };

  const fromName = locationNames[fromLocation] || fromLocation;
  const toName = locationNames[toLocation] || toLocation;

  let result = html;

  // Replace location name variations
  result = result.replace(new RegExp(fromName, 'g'), toName);
  result = result.replace(new RegExp(fromName.toLowerCase(), 'g'), toName.toLowerCase());
  result = result.replace(new RegExp(fromLocation, 'g'), toLocation);

  // Fix URLs: replace location slug in aerosportsparks.ca URLs
  result = result.replace(
    new RegExp(`aerosportsparks\\.ca/${fromLocation}`, 'g'),
    `aerosportsparks.ca/${toLocation}`
  );

  // Handle "St Catharines" without dot
  if (fromLocation === 'st-catharines') {
    result = result.replace(/St Catharines/g, toName);
    result = result.replace(/St\. Catharines/g, toName);
  }
  if (toLocation === 'st-catharines') {
    // Already handled above
  }

  // Handle Mississauga references for oakville
  if (fromLocation === 'oakville') {
    result = result.replace(/Mississauga/g, getAreaName(toLocation));
  }
  if (toLocation === 'oakville') {
    // Keep as is
  }

  return result;
}

function getAreaName(location) {
  const areas = {
    'oakville': 'Mississauga',
    'london': 'London',
    'windsor': 'Windsor',
    'st-catharines': 'the Niagara Region',
    'scarborough': 'Scarborough',
  };
  return areas[location] || location;
}

main().catch(console.error);
