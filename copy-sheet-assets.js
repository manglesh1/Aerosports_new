const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const manifestPath = path.join(process.cwd(), 'asset-migration', 'sheet-assets.json');
const assets = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const sourceBucket = 'gs://aerosports';
const destBucket = 'gs://media.aerosportsparks.ca';
const concurrency = 6;
const results = [];
let index = 0;
let active = 0;
let completed = 0;

function runCopy(asset) {
  return new Promise((resolve) => {
    const src = `${sourceBucket}/${asset.objectPath}`;
    const dst = `${destBucket}/${asset.objectPath}`;
    const child = spawn('gcloud', [
      'storage', 'cp',
      '--cache-control=public,max-age=31536000,immutable',
      src,
      dst,
    ], {
      shell: true,
      env: {
        ...process.env,
        CLOUDSDK_CONFIG: path.join(process.cwd(), '.gcloud'),
      },
    });
    let stderr = '';
    let stdout = '';
    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });
    child.on('close', (code) => {
      resolve({ objectPath: asset.objectPath, code, stdout, stderr });
    });
  });
}

async function pump() {
  while (active < concurrency && index < assets.length) {
    const asset = assets[index++];
    active++;
    runCopy(asset).then((result) => {
      active--;
      completed++;
      results.push(result);
      if (result.code === 0) {
        console.log(`[${completed}/${assets.length}] copied ${result.objectPath}`);
      } else {
        console.error(`[${completed}/${assets.length}] FAILED ${result.objectPath}\n${result.stderr || result.stdout}`);
      }
      pump();
    });
  }
  if (completed === assets.length) {
    const summary = {
      total: assets.length,
      copied: results.filter((r) => r.code === 0).length,
      failed: results.filter((r) => r.code !== 0).length,
      failedItems: results.filter((r) => r.code !== 0).map((r) => ({ objectPath: r.objectPath, stderr: r.stderr.slice(0, 1200) })),
    };
    fs.writeFileSync(path.join(process.cwd(), 'asset-migration', 'copy-results.json'), JSON.stringify(summary, null, 2));
    console.log(JSON.stringify(summary, null, 2));
  }
}

pump();
