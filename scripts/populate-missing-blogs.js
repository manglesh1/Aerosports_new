/**
 * Populate Missing Blog Content from DOCX Files
 *
 * Reads docx files from C:\Users\mn\Downloads\blogs,
 * extracts the blog content (after the metadata table),
 * matches to missing blog entries in Google Sheet by title,
 * and updates section1 via the API.
 *
 * Usage: node scripts/populate-missing-blogs.js [--dry-run]
 */

const mammoth = require('mammoth');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const BLOG_DIR = 'C:/Users/mn/Downloads/blogs';
const SHEET_FILE = path.join(__dirname, '..', 'aerosports_data.xlsx');
const API_URL = 'http://localhost:3000/api/sheet';
const DRY_RUN = process.argv.includes('--dry-run');

function normalize(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanBlogHtml(html) {
  // Remove Google Docs anchor tags (empty <a id="..."></a>)
  let cleaned = html.replace(/<a\s+id="[^"]*"><\/a>/g, '');

  // Remove empty headings
  cleaned = cleaned.replace(/<h[1-6]>\s*<\/h[1-6]>/g, '');

  // Clean up double spaces
  cleaned = cleaned.replace(/\s{2,}/g, ' ');

  // Remove leading/trailing whitespace in tags
  cleaned = cleaned.replace(/>\s+</g, '><');

  // But add back single space between inline elements
  cleaned = cleaned.replace(/<\/p><p>/g, '</p>\n<p>');
  cleaned = cleaned.replace(/<\/h(\d)><h/g, '</h$1>\n<h');
  cleaned = cleaned.replace(/<\/h(\d)><p/g, '</h$1>\n<p');
  cleaned = cleaned.replace(/<\/p><h/g, '</p>\n<h');
  cleaned = cleaned.replace(/<\/ul><h/g, '</ul>\n<h');
  cleaned = cleaned.replace(/<\/ol><h/g, '</ol>\n<h');
  cleaned = cleaned.replace(/<\/ul><p/g, '</ul>\n<p');
  cleaned = cleaned.replace(/<\/ol><p/g, '</ol>\n<p');

  return cleaned.trim();
}

async function extractDocxData(filePath) {
  const result = await mammoth.convertToHtml({ path: filePath });
  const html = result.value;

  // Extract metadata from table
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

  // Extract content after the table
  const parts = html.split('</table>');
  const content = parts.slice(1).join('</table>');
  const cleanedContent = cleanBlogHtml(content);

  return {
    topic: metadata['Topic'] || '',
    keywords: metadata['Keywords'] || '',
    refLinks: metadata['Ref Links'] || '',
    content: cleanedContent,
    contentLength: cleanedContent.replace(/<[^>]*>/g, '').trim().length,
  };
}

async function main() {
  console.log(`\n📝 Populate Missing Blog Content from DOCX Files`);
  console.log(`Mode: ${DRY_RUN ? '🔍 DRY RUN' : '🚀 LIVE'}\n`);

  // Read sheet data
  const wb = XLSX.readFile(SHEET_FILE);
  const ws = wb.Sheets['Data'];
  const data = XLSX.utils.sheet_to_json(ws, { defval: '' });

  const blogs = data
    .map((row, index) => ({ ...row, _rowIndex: index }))
    .filter(r => r.parentid === 'blogs');

  const missingBlogs = blogs.filter(b => !b.section1 || b.section1.trim().length < 50);
  console.log(`📊 Total blogs: ${blogs.length}, Missing content: ${missingBlogs.length}\n`);

  // Read all docx files
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.docx'));
  console.log(`📁 Found ${files.length} docx files\n`);

  const docxData = [];
  for (const file of files) {
    try {
      const extracted = await extractDocxData(path.join(BLOG_DIR, file));
      if (extracted && extracted.content.length > 100) {
        docxData.push({ ...extracted, file });
      }
    } catch (e) {
      console.log(`  ⚠️  Error reading ${file}: ${e.message}`);
    }
  }

  console.log(`📄 Extracted content from ${docxData.length} docx files\n`);

  // Match docx content to missing blogs by title similarity
  const matches = [];
  const usedDocs = new Set();

  for (const blog of missingBlogs) {
    const blogTitleNorm = normalize(blog.title);
    let bestMatch = null;
    let bestScore = 0;

    for (let i = 0; i < docxData.length; i++) {
      if (usedDocs.has(i)) continue;

      const doc = docxData[i];
      const docTopicNorm = normalize(doc.topic);

      // Exact title match
      if (docTopicNorm === blogTitleNorm) {
        bestMatch = i;
        bestScore = 1.0;
        break;
      }

      // Fuzzy match - check if most words overlap
      const blogWords = new Set(blogTitleNorm.split(' ').filter(w => w.length > 2));
      const docWords = new Set(docTopicNorm.split(' ').filter(w => w.length > 2));
      const intersection = [...blogWords].filter(w => docWords.has(w));
      const score = intersection.length / Math.max(blogWords.size, 1);

      if (score > bestScore && score >= 0.6) {
        bestMatch = i;
        bestScore = score;
      }
    }

    if (bestMatch !== null) {
      usedDocs.add(bestMatch);
      matches.push({
        blog,
        doc: docxData[bestMatch],
        score: bestScore,
      });
    }
  }

  console.log(`\n🔗 Matched ${matches.length} / ${missingBlogs.length} missing blogs to docx files\n`);

  // Show matches
  for (const m of matches) {
    const statusIcon = m.score >= 0.8 ? '✅' : '⚠️';
    console.log(`${statusIcon} [${(m.score * 100).toFixed(0)}%] Blog: "${m.blog.title.substring(0, 80)}"`);
    console.log(`        Doc:  "${m.doc.topic.substring(0, 80)}" (${m.doc.file})`);
    console.log(`        Content: ${m.doc.contentLength} chars | Location: ${m.blog.location} | Row: ${m.blog._rowIndex}`);
    console.log('');
  }

  // Show unmatched blogs
  const matchedPaths = new Set(matches.map(m => m.blog._rowIndex));
  const unmatched = missingBlogs.filter(b => !matchedPaths.has(b._rowIndex));
  if (unmatched.length > 0) {
    console.log(`\n❌ Unmatched blogs (${unmatched.length}):`);
    unmatched.forEach(b => {
      console.log(`  - ${b.location}/${b.path}: ${b.title.substring(0, 80)}`);
    });
  }

  // Show unused docs
  const unusedDocs = docxData.filter((_, i) => !usedDocs.has(i));
  if (unusedDocs.length > 0) {
    console.log(`\n📄 Unused docx files (${unusedDocs.length}):`);
    unusedDocs.forEach(d => {
      console.log(`  - ${d.file}: "${d.topic.substring(0, 80)}" (${d.contentLength} chars)`);
    });
  }

  if (DRY_RUN) {
    // Write match report
    const reportPath = path.join(__dirname, 'blog-match-report.json');
    const report = matches.map(m => ({
      rowIndex: m.blog._rowIndex,
      blogPath: m.blog.path,
      blogTitle: m.blog.title,
      location: m.blog.location,
      docFile: m.doc.file,
      docTopic: m.doc.topic,
      matchScore: m.score,
      contentChars: m.doc.contentLength,
      contentPreview: m.doc.content.replace(/<[^>]*>/g, '').substring(0, 200),
    }));
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Match report written to: ${reportPath}`);
    console.log(`   Review it, then run without --dry-run to apply.\n`);
  } else {
    console.log(`\n🔄 Updating Google Sheet via API...\n`);
    let successCount = 0;
    let failCount = 0;

    for (const m of matches) {
      if (m.score < 0.6) {
        console.log(`  ⏭️  Skipping low-score match: ${m.blog.title.substring(0, 60)} (${(m.score * 100).toFixed(0)}%)`);
        continue;
      }

      try {
        const res = await fetch(`${API_URL}?row=${m.blog._rowIndex}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section1: m.doc.content }),
        });

        if (res.ok) {
          successCount++;
          console.log(`  ✅ Row ${m.blog._rowIndex} — ${m.blog.location}/${m.blog.path}`);
        } else {
          failCount++;
          const err = await res.text();
          console.log(`  ❌ Row ${m.blog._rowIndex}: ${err}`);
        }
      } catch (err) {
        failCount++;
        console.log(`  ❌ Row ${m.blog._rowIndex}: ${err.message}`);
      }

      await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\n✅ Done: ${successCount} updated, ${failCount} failed\n`);
  }
}

main().catch(console.error);
