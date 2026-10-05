// Loopback-only release-upgrade harness. Never use this as the production server.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const current = resolve('dist'), previous = process.env.PWA_PREVIOUS_DIST && resolve(process.env.PWA_PREVIOUS_DIST);
if (!previous) throw new Error('PWA_PREVIOUS_DIST must identify a compiled previous release.');
await stat(resolve(previous, 'sw.js'));
await stat(resolve(current, 'sw.js'));
let phase = 'current';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1:5180');
    if (url.pathname === '/__pwa/phase') {
      if (req.method === 'POST') {
        const next = url.searchParams.get('value');
        if (!['previous', 'current', 'updated'].includes(next)) { res.writeHead(400).end(); return; }
        phase = next;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ phase }));
      return;
    }
    const base = phase === 'previous' ? previous : current;
    let path = resolve(base, '.' + decodeURIComponent(url.pathname));
    if (path !== base && !path.startsWith(base + sep)) { res.writeHead(403).end(); return; }
    try { if (!(await stat(path)).isFile()) path = resolve(base, 'index.html'); }
    catch { if (extname(path)) { res.writeHead(404).end(); return; } path = resolve(base, 'index.html'); }
    let body = await readFile(path);
    if (phase === 'updated' && url.pathname === '/sw.js') body = Buffer.concat([body, Buffer.from('\n// synthetic next release\n')]);
    res.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' }).end(body);
  } catch { res.writeHead(500).end(); }
}).listen(5180, '127.0.0.1');
