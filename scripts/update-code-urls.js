#!/usr/bin/env node
/**
 * Update hardcoded GCP image URLs in source code to point to webp/ folder
 *
 * Reads image-url-mapping.json and replaces URLs in .js/.jsx/.css/.html files
 *
 * Usage:
 *   node scripts/update-code-urls.js              # Dry run
 *   node scripts/update-code-urls.js --apply      # Apply changes
 */

const fs = require('fs');
const path = require('path');

const MAPPING_FILE = path.join(__dirname, '..', 'image-url-mapping.json');
const SRC_DIR = path.join(__dirname, '..', 'src');
const CODE_EXTS = ['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.mjs'];

function walkDir(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.next') {
      files.push(...walkDir(full));
    } else if (entry.isFile() && CODE_EXTS.includes(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

function main() {
  const apply = process.argv.includes('--apply');
  console.log(`🔧 Code URL Updater ${apply ? '(APPLY MODE)' : '(DRY RUN)'}`);

  if (!fs.existsSync(MAPPING_FILE)) {
    console.error('❌ Mapping file not found. Run convert-to-webp.js --map first.');
    process.exit(1);
  }

  const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));
  console.log(`   Loaded ${Object.keys(mapping).length} URL mappings\n`);

  // Build search patterns from the base URL
  const BASE = 'https://storage.googleapis.com/aerosports/';

  // Also scan root level files (next.config.mjs, test.html)
  const codeFiles = [
    ...walkDir(SRC_DIR),
    path.join(__dirname, '..', 'next.config.mjs'),
    path.join(__dirname, '..', 'test.html'),
  ].filter(f => fs.existsSync(f));

  let totalChanges = 0;

  for (const file of codeFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content;
    let fileChanges = 0;

    for (const [oldUrl, newUrl] of Object.entries(mapping)) {
      if (newContent.includes(oldUrl)) {
        newContent = newContent.split(oldUrl).join(newUrl);
        fileChanges++;
      }
      // Also check URL-encoded version
      const encodedOld = oldUrl.replace(/ /g, '%20');
      const encodedNew = newUrl.replace(/ /g, '%20');
      if (newContent.includes(encodedOld)) {
        newContent = newContent.split(encodedOld).join(encodedNew);
        fileChanges++;
      }
    }

    if (fileChanges > 0) {
      const relPath = path.relative(path.join(__dirname, '..'), file);
      console.log(`  📄 ${relPath}: ${fileChanges} URL(s) updated`);
      totalChanges += fileChanges;

      if (apply) {
        fs.writeFileSync(file, newContent, 'utf8');
      }
    }
  }

  console.log(`\n📊 Total: ${totalChanges} URLs to update in source code`);

  if (!apply && totalChanges > 0) {
    console.log('\n💡 Run with --apply to make these changes:');
    console.log('   node scripts/update-code-urls.js --apply');
  } else if (apply) {
    console.log('\n✅ All code changes applied!');
  }
}

main();
