/* Serve the exported site on loopback only; no npm dependencies at runtime. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = 43119;
const APP_ID = 'dual-quotient-manual-portable-v1';
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.webp': 'image/webp',
};

function createServer(root) {
  const siteRoot = fs.realpathSync(root);
  const server = http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Dual-Quotient-Manual', APP_ID);
    const port = server.address().port;
    if (![`127.0.0.1:${port}`, `localhost:${port}`].includes(req.headers.host)) {
      res.writeHead(421); return res.end('Unexpected host');
    }
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end();
    }
    let pathname;
    try {
      pathname = decodeURIComponent(req.url.split('?')[0]);
      if (!pathname.startsWith('/') || /[\\\0:]/.test(pathname) ||
          pathname.split('/').some(part => part === '..' || part.startsWith('.'))) {
        throw new Error('Invalid path');
      }
    } catch {
      res.writeHead(400); return res.end('Invalid path');
    }
    if (pathname === '/__dq_health') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ app: APP_ID }));
    }
    try {
      let filename = path.join(siteRoot, pathname);
      let status = 200;
      try {
        if ((await fs.promises.stat(filename)).isDirectory()) filename = path.join(filename, 'index.html');
        filename = await fs.promises.realpath(filename);
        if (!filename.startsWith(siteRoot + path.sep)) throw new Error('Outside site');
      } catch {
        status = 404;
        filename = path.join(siteRoot, '404.html');
      }
      const data = await fs.promises.readFile(filename);
      res.writeHead(status, {
        'Content-Type': TYPES[path.extname(filename)] || 'application/octet-stream',
        'Content-Length': data.length,
      });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch {
      res.writeHead(500); res.end('Unable to read packaged site');
    }
  });
  return server;
}

if (require.main === module) {
  const server = createServer(path.join(__dirname, 'site'));
  server.on('error', error => { console.error(error.code || error.message); process.exit(1); });
  server.listen(PORT, '127.0.0.1', () => console.log('Ready on http://127.0.0.1:' + PORT));
  const parentArg = process.argv.indexOf('--parent-pid');
  const parentPid = Number(process.argv[parentArg + 1]);
  if (parentArg >= 0 && Number.isSafeInteger(parentPid) && parentPid > 0) {
    setInterval(() => {
      try { process.kill(parentPid, 0); } catch { process.exit(0); }
    }, 1000).unref();
  }
}

module.exports = { createServer, PORT, APP_ID };
