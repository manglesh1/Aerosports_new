const { createServer } = require('http');
const { createReadStream, statSync } = require('fs');
const { join, normalize } = require('path');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = Number(process.env.PORT || 3000);
const assetPathPrefix = (process.env.NEXT_ASSET_PATH_PREFIX || '').replace(/\/$/, '');

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
const staticRoot = join(process.cwd(), '.next', 'static');

function contentTypeFor(pathname) {
  if (pathname.endsWith('.js')) return 'application/javascript; charset=UTF-8';
  if (pathname.endsWith('.css')) return 'text/css; charset=UTF-8';
  if (pathname.endsWith('.woff2')) return 'font/woff2';
  if (pathname.endsWith('.woff')) return 'font/woff';
  if (pathname.endsWith('.svg')) return 'image/svg+xml';
  if (pathname.endsWith('.png')) return 'image/png';
  if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) return 'image/jpeg';
  if (pathname.endsWith('.webp')) return 'image/webp';
  return 'application/octet-stream';
}

app.prepare().then(() => {
  createServer((req, res) => {
    if (req.url && assetPathPrefix && req.url.startsWith(`${assetPathPrefix}/_next/image`)) {
      req.url = req.url.slice(assetPathPrefix.length) || req.url;
    }

    const staticPrefix = assetPathPrefix ? `${assetPathPrefix}/_next/static/` : '/_next/static/';

    if (req.url && req.url.startsWith(staticPrefix)) {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const relativePath = pathname.replace(staticPrefix, '');
      const filePath = normalize(join(staticRoot, relativePath));

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

      if (filePath.startsWith(staticRoot)) {
        try {
          const stat = statSync(filePath);
          res.statusCode = 200;
          res.setHeader('Content-Length', stat.size);
          res.setHeader('Content-Type', contentTypeFor(pathname));

          if (req.method === 'HEAD') {
            res.end();
            return;
          }

          createReadStream(filePath).pipe(res);
          return;
        } catch {
          res.statusCode = 404;
          res.end('Not found');
          return;
        }
      }
    }

    handle(req, res);
  }).listen(port, hostname, () => {
    console.log(`Next server listening on http://${hostname}:${port}`);
  });
});
