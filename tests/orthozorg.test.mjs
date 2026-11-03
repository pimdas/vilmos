import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../server.mjs';

test('production serves the Orthozorg proposal with working assets and scoped external resources', async () => {
  const server = createServer({ websiteOnly: true });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const path of ['/orthozorg', '/orthozorg/']) {
      const response = await fetch(origin + path);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.match(html, /Eerst zien,<br>dan behandelen/);
      assert.ok(!html.split('<footer>')[0].includes('reviews-widget'));
      assert.match(html.split('<footer>')[1], /klantenvertellen.nl\/retrieve-widget/);
      const csp = response.headers.get('content-security-policy');
      assert.ok(csp.includes('https://www.klantenvertellen.nl'));
      assert.ok(csp.includes('https://fonts.googleapis.com'));
      assert.ok(csp.includes('https://fonts.gstatic.com'));
      const resources = [...html.matchAll(/(?:src|href)="(\/orthozorg\/[^"#]+)"/g)].map(match => match[1]);
      assert.equal(resources.length, 5);
      for (const resource of resources) {
        const asset = await fetch(origin + resource);
        assert.equal(asset.status, 200, resource);
        assert.ok((await asset.arrayBuffer()).byteLength > 0);
      }
    }
    assert.equal((await fetch(origin + '/orthozorg/', { method: 'HEAD' })).status, 200);
    const home = await fetch(origin);
    assert.match(await home.text(), /Plezier in bouwen/);
    assert.ok(!home.headers.get('content-security-policy').includes('klantenvertellen'));
    for (const path of ['/orthozorg/.git/config', '/orthozorg/unknown', '/studio.js']) {
      assert.equal((await fetch(origin + path)).status, 404);
    }
  } finally { await new Promise(resolve => server.close(resolve)); }
});
