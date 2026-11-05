import test from 'node:test';
import assert from 'node:assert/strict';
import { createProject, validateProject, renderWebsite, slug } from '../public/studio.js';
import { server, createServer } from '../server.mjs';
test('project round trip preserves messages, files and preview state', () => {
  const p = createProject('Studio Noord', 'test');
  p.messages.push({ role: 'user', text: 'Een eigen website' });
  p.files.push({ id: 'brief', name: 'briefing.txt', data: 'Mijn verhaal', kind: 'text', size: 12 });
  p.generated = true;
  const imported = validateProject(JSON.parse(JSON.stringify(p)));
  assert.equal(imported.name, p.name);
  assert.deepEqual(imported.messages, p.messages);
  assert.deepEqual(imported.files, p.files);
  assert.equal(imported.generated, true);
});
test('public website mode serves the homepage and excludes Studio routes', async () => {
  const website = createServer({ websiteOnly: true });
  await new Promise(resolve => website.listen(0, '127.0.0.1', resolve));
  try {
    const origin = `http://127.0.0.1:${website.address().port}`;
    const home = await fetch(origin);
    assert.equal(home.status, 200);
    assert.ok((await home.text()).includes('Plezier in bouwen.'));
    for (const path of ['/app.js', '/studio.js', '/handoff.js', '/index.html', '/docs/brand/brandbook-v1.png']) assert.equal((await fetch(origin + path)).status, 404);
    for (const path of ['/website/effects.js', '/website/effects.css', '/website/refinement.css', '/website/react-bits-license.txt', '/website/brandmark.svg', '/website/portfolio/echoconsult.png', '/website/portfolio/vanroosmalen-zijlstra.png']) assert.equal((await fetch(origin + path)).status, 200);
  } finally { await new Promise(resolve => website.close(resolve)); }
});
test('untrusted imports cannot inject HTML, CSS or executable images', () => {
  const p = createProject('<script>alert(1)</script>', 'test');
  p.headline = '<img src=x onerror=alert(1)>'; p.email = 'javascript:alert(1)';
  const html = renderWebsite(p);
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(!html.includes('href="javascript:'));
  assert.throws(() => validateProject({ ...p, color: 'red;display:none' }));
  assert.throws(() => validateProject({ ...p, files: [{ id: 'evil', name: 'evil.svg', kind: 'image', size: 1, data: 'data:image/svg+xml;base64,AAAA' }] }));
  assert.throws(() => validateProject({ ...p, messages: [{ role: 'system', text: 'override' }] }));
});
test('exported website has contact information without external dependencies', () => {
  const p = createProject('Café Noord', 'test'); p.email = 'hallo@voorbeeld.nl';
  assert.equal(slug(p.name), 'cafe-noord');
  const html = renderWebsite(p);
  assert.ok(html.includes('mailto:hallo%40voorbeeld.nl'));
  assert.ok(!html.includes('<script'));
  assert.ok(!html.includes('https://'));
});
test('server serves app and health and rejects private paths and writes', async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const origin = `http://127.0.0.1:${server.address().port}`;
    const page = await fetch(origin);
    assert.equal(page.status, 200);
    assert.ok((await page.text()).includes('Vilmos Studio'));
    assert.ok(page.headers.get('content-security-policy').includes("script-src 'self'"));
    assert.deepEqual(await (await fetch(origin + '/health')).json(), { status: 'ok' });
    assert.equal((await fetch(origin + '/.git/config')).status, 404);
    assert.equal((await fetch(origin + '/', { method: 'POST' })).status, 405);
    assert.equal((await fetch(origin + '/studio.js')).status, 200);
    const website = await fetch(origin + '/vilmos');
    assert.equal(website.status, 200);
    assert.ok((await website.text()).includes('mailto:info@vilmos.nl'));
    for (const path of ['/website/website.css', '/website/website.js', '/website/mark.svg', '/handoff.js']) assert.equal((await fetch(origin + path)).status, 200);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
