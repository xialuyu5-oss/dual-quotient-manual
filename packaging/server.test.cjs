const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createServer, APP_ID } = require('./server.cjs');

let root, server, port;
before(async () => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'dq-portable-test-'));
  fs.mkdirSync(path.join(root, 'manual', 'sample'), { recursive: true });
  fs.writeFileSync(path.join(root, 'index.html'), '<h1>home</h1>');
  fs.writeFileSync(path.join(root, 'manual', 'sample', 'index.html'), '<h1>chapter</h1>');
  fs.writeFileSync(path.join(root, 'payload.txt'), 'rsc-payload');
  fs.writeFileSync(path.join(root, '404.html'), '<h1>not-found</h1>');
  server = createServer(root);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  port = server.address().port;
});
after(async () => {
  await new Promise(resolve => server.close(resolve));
  // Only this test's uniquely created temporary directory is removed.
  assert.equal(path.dirname(path.resolve(root)), path.resolve(os.tmpdir()));
  assert.ok(path.basename(root).startsWith('dq-portable-test-'));
  fs.rmSync(root, { recursive: true, force: true });
});
function request(url, method = 'GET', host = `127.0.0.1:${port}`) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port, path: url, method, headers: { Host: host } }, res => {
      let body = '';
      res.setEncoding('utf8'); res.on('data', chunk => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject); req.end();
  });
}
test('home and chapter routes resolve from the exported directory', async () => {
  assert.match((await request('/')).body, /home/);
  assert.match((await request('/manual/sample/')).body, /chapter/);
  assert.match((await request('/manual/sample')).body, /chapter/);
});
test('client navigation payloads preserve their contents', async () => {
  const result = await request('/payload.txt?_rsc=example');
  assert.equal(result.status, 200); assert.equal(result.body, 'rsc-payload');
});
test('health identifies this app and HEAD has no response body', async () => {
  assert.equal(JSON.parse((await request('/__dq_health')).body).app, APP_ID);
  assert.equal((await request('/', 'HEAD')).body, '');
});
test('unknown routes return the packaged 404 with HTTP 404', async () => {
  const result = await request('/does-not-exist/');
  assert.equal(result.status, 404); assert.match(result.body, /not-found/);
});
test('traversal, malformed escaping and private paths cannot expose files', async () => {
  for (const url of ['/../secret', '/%2e%2e/secret', '/%5c..%5csecret', '/%00', '/%ZZ', '/.env', '/C:/Windows']) {
    assert.equal((await request(url)).status, 400, url);
  }
});
test('foreign host headers and write methods are rejected', async () => {
  assert.equal((await request('/', 'GET', 'outside.example')).status, 421);
  assert.equal((await request('/', 'POST')).status, 405);
});
