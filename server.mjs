import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('./public/', import.meta.url);
// Explicit allowlist keeps repository files outside the public surface.
const routes = { '/website/portfolio/echoconsult.png': ['website/portfolio/echoconsult.png', 'image/png'], '/website/portfolio/vanroosmalen-zijlstra.png': ['website/portfolio/vanroosmalen-zijlstra.png', 'image/png'], '/website/brandmark.svg': ['website/brandmark.svg', 'image/svg+xml'], '/vilmos': ['website/index.html', 'text/html; charset=utf-8'], '/vilmos/': ['website/index.html', 'text/html; charset=utf-8'], '/website/website.css': ['website/website.css', 'text/css; charset=utf-8'], '/website/website.js': ['website/website.js', 'text/javascript; charset=utf-8'], '/website/mark.svg': ['website/mark.svg', 'image/svg+xml'], '/': ['index.html', 'text/html; charset=utf-8'], '/app.js': ['app.js', 'text/javascript; charset=utf-8'], '/studio.js': ['studio.js', 'text/javascript; charset=utf-8'], '/style.css': ['style.css', 'text/css; charset=utf-8'] };
export function createServer({ websiteOnly = process.env.SITE_MODE === 'website' } = {}) {
return http.createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/health') { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(req.method === 'HEAD' ? undefined : '{"status":"ok"}'); return; }
  const websitePath = pathname === '/' ? '/vilmos' : pathname;
  const route = websiteOnly
    ? (websitePath === '/vilmos' || websitePath === '/vilmos/' || websitePath.startsWith('/website/')) && routes[websitePath]
    : pathname === '/handoff.js' ? ['handoff.js', 'text/javascript; charset=utf-8'] : routes[pathname];
  if (!route) { res.writeHead(404); res.end('Niet gevonden'); return; }
  try {
    const body = await readFile(new URL(route[0], root));
    res.writeHead(200, { 'Content-Type': route[1], 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Cache-Control': 'no-store', 'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; frame-src 'self' blob:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'" });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(500); res.end('Kan de Studio niet laden'); }
});
}
export const server = createServer();
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log(`Vilmos: http://localhost:${server.address().port}`));
}
