/**
 * Blog Backlink Injection Script
 *
 * Reads all blog posts from Google Sheet via XLSX export,
 * injects internal backlinks to relevant location pages based
 * on keyword matching, and updates the sheet via OAuth2.
 *
 * Usage: node scripts/inject-blog-backlinks.js [--dry-run]
 */

const { google } = require('googleapis');
const axios = require('axios');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const SHEET_EXPORT_URL = 'https://docs.google.com/spreadsheets/d/1B_9EaTQDztWGH_cD3lUP7hpWD6FvNBJ-6Czml2x7d9c/export?format=xlsx';
const SPREADSHEET_ID = '1B_9EaTQDztWGH_cD3lUP7hpWD6FvNBJ-6Czml2x7d9c';
const BASE_URL = 'https://www.aerosportsparks.ca';

const CREDS_FILE = 'C:/Users/mn/Downloads/client_secret_513713361578-cera1056kq8q51uvvr0cberr415f7bhf.apps.googleusercontent.com.json';
const TOKEN_FILE = path.join(__dirname, '.oauth-token.json');

const DRY_RUN = process.argv.includes('--dry-run');

// ──────────────────────────────────────────────
// Keyword → page path mapping per location
// Each entry: { keywords: [...], pagePath, anchorText }
// ──────────────────────────────────────────────
function getKeywordMappings(location) {
  const loc = location;

  // Attractions available per location
  const attractionsByLocation = {
    'oakville': ['open-jump', 'valo-arena', 'wipeout', 'climb-slide', 'climbing-walls', 'dodgeball', 'slam-basketball', 'ninja-warrior', 'aero-drop', 'full-arcade'],
    'london': ['open-jump', 'battle-beam', 'valo-jump', 'interactive-floor', 'climbing-walls', 'dodgeball', 'slam-basketball', 'ninja-warrior', 'aero-ladder', 'warped-walls', 'aero-drop', 'full-arcade', 'ninjatag'],
    'windsor': ['open-jump', 'dark-ride-theater', 'hexaquest', 'battle-beam', 'dodgeball', 'slam-basketball', 'ninja-warrior', 'aero-ladder', 'aero-drop', 'tile-hunt', 'soft-play'],
    'st-catharines': ['open-jump', 'hexaquest', 'golf-glow-dark-mini-putt', 'archery', 'aero-hoops', 'battle-beam', 'dodgeball', 'slam-basketball', 'ninja-warrior', 'aero-ladder', 'tile-hunt', 'ninjatag', 'axe-throw', 'arcade'],
    'scarborough': ['open-jump', 'rock-wall', 'go-kart', '360-bike', 'donut-slide', 'dodgeball', 'slam-basketball', 'bazooka-ball', 'laser-tag', 'mini-golf', 'ninja-warrior'],
  };

  const locAttractions = attractionsByLocation[loc] || [];

  // Core keyword mappings (applicable to all locations)
  const mappings = [
    // Main pages
    {
      keywords: ['trampoline park', 'trampoline parks', 'trampolines', 'jumping on trampolines', 'trampoline activities'],
      pagePath: `/${loc}/attractions/open-jump`,
      anchorText: 'trampoline park',
      condition: () => locAttractions.includes('open-jump'),
    },
    {
      keywords: ['birthday party', 'birthday parties', 'kids birthday', 'birthday celebration', 'birthday venue', 'birthday party venue', 'party venue'],
      pagePath: `/${loc}/kids-birthday-parties`,
      anchorText: 'birthday parties',
    },
    {
      keywords: ['group event', 'group events', 'team building', 'team-building', 'corporate event', 'corporate events', 'corporate outing', 'corporate parties'],
      pagePath: `/${loc}/groups-events/corporate-parties-events-groups`,
      anchorText: 'corporate events and group outings',
    },
    {
      keywords: ['school group', 'school groups', 'field trip', 'field trips', 'school outing'],
      pagePath: `/${loc}/groups-events/school-groups`,
      anchorText: 'school group events',
    },
    {
      keywords: ['membership', 'member pass', 'unlimited pass', 'monthly pass'],
      pagePath: `/${loc}/membership`,
      anchorText: 'membership',
    },
    {
      keywords: ['toddler', 'toddlers', 'toddler time', 'little ones'],
      pagePath: `/${loc}/programs/toddler-time`,
      anchorText: 'Toddler Time program',
    },
    {
      keywords: ['glow night', 'glow nights', 'glow party', 'glow in the dark'],
      pagePath: `/${loc}/programs/glow`,
      anchorText: 'Glow Nights',
    },
    {
      keywords: ['summer camp', 'summer camps', 'kids camp', 'day camp'],
      pagePath: `/${loc}/programs/${loc === 'london' || loc === 'oakville' || loc === 'scarborough' ? 'aero-camp' : 'camps'}`,
      anchorText: 'summer camps',
      condition: () => ['st-catharines', 'windsor', 'london', 'oakville', 'scarborough'].includes(loc),
    },
    // Attractions
    {
      keywords: ['ninja warrior', 'ninja course', 'ninja obstacle', 'obstacle course'],
      pagePath: `/${loc}/attractions/ninja-warrior`,
      anchorText: 'Ninja Warrior course',
      condition: () => locAttractions.includes('ninja-warrior'),
    },
    {
      keywords: ['dodgeball', 'dodge ball'],
      pagePath: `/${loc}/attractions/dodgeball`,
      anchorText: 'dodgeball',
      condition: () => locAttractions.includes('dodgeball'),
    },
    {
      keywords: ['basketball', 'slam dunk', 'slam basketball', 'aero hoops', 'jump basketball'],
      pagePath: `/${loc}/attractions/slam-basketball`,
      anchorText: 'Slam Basketball',
      condition: () => locAttractions.includes('slam-basketball'),
    },
    {
      keywords: ['rock climbing', 'climbing wall', 'climbing walls', 'rock wall'],
      pagePath: `/${loc}/attractions/${loc === 'scarborough' ? 'rock-wall' : 'climbing-walls'}`,
      anchorText: 'climbing walls',
      condition: () => locAttractions.includes('climbing-walls') || locAttractions.includes('rock-wall'),
    },
    {
      keywords: ['arcade', 'arcade games', 'video games', 'gaming'],
      pagePath: `/${loc}/attractions/${loc === 'st-catharines' ? 'arcade' : 'full-arcade'}`,
      anchorText: 'arcade',
      condition: () => locAttractions.includes('full-arcade') || locAttractions.includes('arcade'),
    },
    {
      keywords: ['mini golf', 'mini putt', 'mini-putt', 'glow putt', 'glow-in-the-dark mini putt'],
      pagePath: `/${loc}/attractions/${loc === 'st-catharines' ? 'golf-glow-dark-mini-putt' : 'mini-golf'}`,
      anchorText: 'glow-in-the-dark mini putt',
      condition: () => locAttractions.includes('golf-glow-dark-mini-putt') || locAttractions.includes('mini-golf'),
    },
    {
      keywords: ['axe throwing', 'axe throw', 'axe-throwing'],
      pagePath: `/${loc}/attractions/axe-throw`,
      anchorText: 'axe throwing',
      condition: () => locAttractions.includes('axe-throw'),
    },
    {
      keywords: ['battle beam', 'battle beams', 'beam battle'],
      pagePath: `/${loc}/attractions/battle-beam`,
      anchorText: 'Battle Beam',
      condition: () => locAttractions.includes('battle-beam'),
    },
    {
      keywords: ['laser tag', 'lasertag'],
      pagePath: `/${loc}/attractions/laser-tag`,
      anchorText: 'Laser Tag',
      condition: () => locAttractions.includes('laser-tag'),
    },
    {
      keywords: ['go kart', 'go-kart', 'go karts', 'go-karts', 'karting'],
      pagePath: `/${loc}/attractions/go-kart`,
      anchorText: 'Go-Kart Racing',
      condition: () => locAttractions.includes('go-kart'),
    },
    {
      keywords: ['vr', 'virtual reality', 'valo arena', 'valo jump'],
      pagePath: `/${loc}/attractions/${locAttractions.includes('valo-arena') ? 'valo-arena' : 'valo-jump'}`,
      anchorText: 'VR experiences',
      condition: () => locAttractions.includes('valo-arena') || locAttractions.includes('valo-jump'),
    },
    {
      keywords: ['indoor playground', 'indoor play area', 'indoor play', 'play area'],
      pagePath: `/${loc}/attractions`,
      anchorText: 'indoor playground',
    },
    {
      keywords: ['attractions', 'activities', 'things to do', 'fun activities'],
      pagePath: `/${loc}/attractions`,
      anchorText: 'attractions at AeroSports',
    },
    {
      keywords: ['fundrais', 'fund rais', 'fund-rais'],
      pagePath: `/${loc}/groups-events/fund-raising`,
      anchorText: 'fundraising events',
    },
    {
      keywords: ['facility rental', 'venue rental', 'private event', 'rent the facility'],
      pagePath: `/${loc}/groups-events/facility-rental`,
      anchorText: 'facility rental',
    },
  ];

  return mappings.filter(m => !m.condition || m.condition());
}

// ──────────────────────────────────────────────
// Inject backlinks into HTML content
// Uses a tokenizer to separate text from tags/anchors,
// only injects links into safe plain-text tokens.
// ──────────────────────────────────────────────
function tokenizeHtml(html) {
  // Split into tokens: anchor blocks, HTML tags, and text
  const tokens = [];
  let pos = 0;

  while (pos < html.length) {
    // Check for anchor tag
    if (html.slice(pos).match(/^<a[\s>]/i)) {
      const closeIdx = html.indexOf('</a>', pos);
      if (closeIdx !== -1) {
        const end = closeIdx + 4;
        tokens.push({ type: 'anchor', value: html.slice(pos, end) });
        pos = end;
        continue;
      }
    }

    // Check for any HTML tag
    if (html[pos] === '<') {
      const tagEnd = html.indexOf('>', pos);
      if (tagEnd !== -1) {
        tokens.push({ type: 'tag', value: html.slice(pos, tagEnd + 1) });
        pos = tagEnd + 1;
        continue;
      }
    }

    // Plain text — read until next '<'
    const nextTag = html.indexOf('<', pos);
    const end = nextTag === -1 ? html.length : nextTag;
    if (end > pos) {
      tokens.push({ type: 'text', value: html.slice(pos, end) });
    }
    pos = end;
  }

  return tokens;
}

function injectBacklinks(html, location, blogPath) {
  if (!html || html.trim().length === 0) return { html, linksAdded: 0 };

  const mappings = getKeywordMappings(location);

  // Collect URLs already linked in the content
  const existingLinks = new Set();
  const existingLinkRegex = /<a[^>]*href="([^"]*)"[^>]*>/gi;
  let existingMatch;
  while ((existingMatch = existingLinkRegex.exec(html)) !== null) {
    existingLinks.add(existingMatch[1]);
  }

  let linksAdded = 0;
  const linkedPaths = new Set();

  // Skip pages already linked
  for (const url of existingLinks) {
    for (const mapping of mappings) {
      if (url.includes(mapping.pagePath)) {
        linkedPaths.add(mapping.pagePath);
      }
    }
  }

  const tokens = tokenizeHtml(html);

  for (const mapping of mappings) {
    if (linkedPaths.has(mapping.pagePath)) continue;
    if (linksAdded >= 5) break;

    for (const keyword of mapping.keywords) {
      if (linkedPaths.has(mapping.pagePath)) break;
      if (linksAdded >= 5) break;

      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b(${escapedKeyword}s?)\\b`, 'i');

      let replaced = false;
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type !== 'text') continue;

        const match = tokens[i].value.match(regex);
        if (match) {
          const originalText = match[1];
          const link = `<a href="${BASE_URL}${mapping.pagePath}" title="${mapping.anchorText}">${originalText}</a>`;
          const before = tokens[i].value.substring(0, match.index);
          const after = tokens[i].value.substring(match.index + match[0].length);

          // Replace the text token with [before-text, anchor, after-text]
          const newTokens = [];
          if (before) newTokens.push({ type: 'text', value: before });
          newTokens.push({ type: 'anchor', value: link });
          if (after) newTokens.push({ type: 'text', value: after });
          tokens.splice(i, 1, ...newTokens);

          linkedPaths.add(mapping.pagePath);
          linksAdded++;
          replaced = true;
          break;
        }
      }
      if (replaced) break;
    }
  }

  return { html: tokens.map(t => t.value).join(''), linksAdded };
}

// ──────────────────────────────────────────────
// OAuth2 setup
// ──────────────────────────────────────────────
function getOAuthClient() {
  const creds = JSON.parse(fs.readFileSync(CREDS_FILE, 'utf-8'));
  const { client_id, client_secret } = creds.installed;
  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, 'http://localhost');
  const token = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
  oauth2Client.setCredentials(token);
  return oauth2Client;
}

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────
async function main() {
  console.log(`\n📝 Blog Backlink Injection Script`);
  console.log(`Mode: ${DRY_RUN ? '🔍 DRY RUN (no changes)' : '🚀 LIVE (will update sheet)'}\n`);

  // Fetch fresh sheet data via XLSX export
  console.log('Fetching sheet data...');
  const response = await axios.get(SHEET_EXPORT_URL, { responseType: 'arraybuffer' });
  const wb = XLSX.read(response.data, { type: 'buffer' });
  const ws = wb.Sheets['Data'];
  const data = XLSX.utils.sheet_to_json(ws, { defval: '' });

  const blogs = data
    .map((row, index) => ({ ...row, _rowIndex: index }))
    .filter(r => r.parentid === 'blogs' && r.section1 && r.section1.trim().length > 50);

  console.log(`Found ${blogs.length} blog posts with content\n`);

  let totalLinksAdded = 0;
  let blogsUpdated = 0;
  const results = [];

  for (const blog of blogs) {
    const { html: updatedHtml, linksAdded } = injectBacklinks(
      blog.section1,
      blog.location,
      blog.path
    );

    if (linksAdded > 0) {
      totalLinksAdded += linksAdded;
      blogsUpdated++;

      results.push({
        sheetRow: blog._rowIndex + 2, // 0-indexed data + header row + 1-based
        path: blog.path,
        location: blog.location,
        title: blog.title,
        linksAdded,
        updatedHtml,
      });

      console.log(`  ✅ ${blog.location}/${blog.path} — ${linksAdded} backlinks`);
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 Summary: ${totalLinksAdded} backlinks across ${blogsUpdated} blogs`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  if (DRY_RUN) {
    const previewPath = path.join(__dirname, 'backlink-preview.json');
    const preview = results.map(r => ({
      sheetRow: r.sheetRow,
      path: r.path,
      location: r.location,
      title: r.title,
      linksAdded: r.linksAdded,
      addedLinks: (r.updatedHtml.match(/<a href="https:\/\/www\.aerosportsparks\.ca[^"]*"[^>]*>[^<]*<\/a>/g) || []),
    }));
    fs.writeFileSync(previewPath, JSON.stringify(preview, null, 2));
    console.log(`📄 Preview written to: ${previewPath}`);
    console.log(`   Review it, then run without --dry-run to apply.\n`);
  } else {
    // Write via OAuth2 to correct sheet
    console.log(`🔄 Updating Google Sheet via OAuth2...\n`);
    const oauth2Client = getOAuthClient();
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

    let successCount = 0;
    let failCount = 0;
    const BATCH = 5;

    for (let i = 0; i < results.length; i += BATCH) {
      const batch = results.slice(i, i + BATCH);
      const batchData = batch.map(r => ({
        range: `Data!W${r.sheetRow}`,
        values: [[r.updatedHtml]],
      }));

      try {
        await sheets.spreadsheets.values.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: {
            valueInputOption: 'RAW',
            data: batchData,
          },
        });
        successCount += batch.length;
        console.log(`  ✅ Rows ${batch.map(b => b.sheetRow).join(', ')} updated (${successCount}/${results.length})`);
      } catch (err) {
        failCount += batch.length;
        console.log(`  ❌ Batch failed: ${err.message}`);
      }

      await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\n✅ Done: ${successCount} updated, ${failCount} failed\n`);
  }
}

main().catch(console.error);
