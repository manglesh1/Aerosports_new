/**
 * Update blogs using OAuth2 (installed app) credentials
 *
 * 1. Opens browser for Google login
 * 2. Gets access token
 * 3. Updates all 48 blog rows in the sheet
 */

const { google } = require('googleapis');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const CREDS_FILE = 'C:/Users/mn/Downloads/client_secret_513713361578-cera1056kq8q51uvvr0cberr415f7bhf.apps.googleusercontent.com.json';
const SPREADSHEET_ID = '1m4sAEfIJUaIdnsKYBJeMe0FeESEtGU9ISRqJ_O9TFmo';
const TOKEN_FILE = path.join(__dirname, '.oauth-token.json');

const creds = JSON.parse(fs.readFileSync(CREDS_FILE, 'utf-8'));
const { client_id, client_secret } = creds.installed;
const REDIRECT_URI = 'http://localhost';

const oauth2Client = new google.auth.OAuth2(client_id, client_secret, REDIRECT_URI);

async function getToken() {
  // Check for cached token
  if (fs.existsSync(TOKEN_FILE)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
    oauth2Client.setCredentials(token);

    // Check if token is expired
    if (token.expiry_date && token.expiry_date > Date.now() + 60000) {
      console.log('Using cached token');
      return;
    }

    // Try refresh
    if (token.refresh_token) {
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(credentials);
        fs.writeFileSync(TOKEN_FILE, JSON.stringify(credentials));
        console.log('Token refreshed');
        return;
      } catch (e) {
        console.log('Refresh failed, re-authenticating...');
      }
    }
  }

  // Need new token - open browser
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/spreadsheets'],
    prompt: 'consent',
  });

  console.log('\n🔐 Opening browser for Google login...');
  console.log('If browser does not open, visit this URL:\n');
  console.log(authUrl);
  console.log('');

  // Open browser (use start "" to handle URLs with special chars on Windows)
  exec(`start "" "${authUrl}"`);

  // Start local server to receive callback
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url, REDIRECT_URI);
      const code = url.searchParams.get('code');

      if (code) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>✅ Authenticated! You can close this tab.</h1><script>window.close()</script>');

        try {
          const { tokens } = await oauth2Client.getToken(code);
          oauth2Client.setCredentials(tokens);
          fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens));
          console.log('✅ Authentication successful!\n');
          server.close();
          resolve();
        } catch (err) {
          server.close();
          reject(err);
        }
      } else {
        res.writeHead(400);
        res.end('No code received');
      }
    });

    server.listen(80, () => {
      console.log('Waiting for Google login callback on http://localhost ...');
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error('Authentication timed out after 5 minutes'));
    }, 300000);
  });
}

async function main() {
  console.log('📝 Blog Content Update via OAuth2\n');

  // Load updates
  const updates = JSON.parse(fs.readFileSync(path.join(__dirname, 'sheet-updates.json'), 'utf-8'));
  console.log(`📊 ${updates.length} rows to update\n`);

  // Authenticate
  await getToken();

  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

  // Test read first
  console.log('🔍 Testing connection...');
  const testRead = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Data!A1:A2',
  });
  console.log('✅ Connected to sheet\n');

  // Apply updates in batches of 5
  const BATCH = 5;
  let success = 0;
  let fail = 0;

  for (let i = 0; i < updates.length; i += BATCH) {
    const batch = updates.slice(i, i + BATCH);

    // Use batchUpdate for efficiency
    const data = batch.map(item => ({
      range: `Data!W${item.sheetRow}`,
      values: [[item.content]],
    }));

    try {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          valueInputOption: 'RAW',
          data: data,
        },
      });

      success += batch.length;
      console.log(`  ✅ Rows ${batch.map(b => b.sheetRow).join(', ')} updated (${success}/${updates.length})`);
    } catch (err) {
      fail += batch.length;
      console.log(`  ❌ Batch failed: ${err.message}`);
    }

    // Small delay between batches
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Done: ${success} updated, ${fail} failed`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
