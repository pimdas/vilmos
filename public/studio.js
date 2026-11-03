export const MAX_FILE_SIZE = 2 * 1024 * 1024;
export const MAX_TOTAL_SIZE = 4 * 1024 * 1024;
export function escapeHtml(value) { return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
export function slug(value) { return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'website'; }
export function createProject(name, id) { return { id, name: name.trim() || 'Nieuw project', headline: '', description: '', cta: 'Neem contact op', email: '', color: '#c65d38', messages: [], files: [], generated: false, updatedAt: new Date().toISOString() }; }
export function validateProject(p) {
  if (!p || typeof p !== 'object') throw new Error('Ongeldig projectbestand.');
  for (const [key, max] of Object.entries({ name: 80, headline: 180, description: 1500, cta: 60, email: 180 })) if (typeof p[key] !== 'string' || p[key].length > max) throw new Error('Ongeldige projectgegevens.');
  if (!/^#[0-9a-f]{6}$/i.test(p.color) || !Array.isArray(p.messages) || p.messages.length > 200 || !Array.isArray(p.files) || p.files.length > 20) throw new Error('Ongeldige projectgegevens.');
  if (p.messages.some(m => !m || !['user', 'assistant'].includes(m.role) || typeof m.text !== 'string' || m.text.length > 8000)) throw new Error('Ongeldige berichten.');
  let total = 0;
  for (const f of p.files) {
    if (!f || typeof f.id !== 'string' || typeof f.name !== 'string' || f.name.length > 255 || typeof f.data !== 'string' || !Number.isFinite(f.size) || f.size < 0 || f.size > MAX_FILE_SIZE) throw new Error('Ongeldig bestand.');
    const image = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(f.data);
    if (f.kind !== 'image' && f.kind !== 'text' || f.kind === 'image' && !image || f.data.length > MAX_FILE_SIZE * 1.4) throw new Error('Ongeldig bestandsformaat.');
    total += f.data.length;
  }
  if (total > MAX_TOTAL_SIZE) throw new Error('Bestanden zijn samen te groot.');
  return { ...createProject(p.name, ''), ...Object.fromEntries(['name', 'headline', 'description', 'cta', 'email', 'color'].map(k => [k, p[k]])), messages: p.messages.map(m => ({ role: m.role, text: m.text })), files: p.files.map(f => ({ id: f.id, name: f.name, data: f.data, size: f.size, kind: f.kind })), generated: p.generated === true };
}
export function renderWebsite(project) {
  const p = validateProject(project);
  const e = escapeHtml;
  const logo = p.files.find(f => f.kind === 'image');
  const contact = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(p.email) ? `mailto:${encodeURIComponent(p.email)}` : '#contact';
  return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>${e(p.name)}</title><meta name="description" content="${e(p.description)}"><style>*{box-sizing:border-box}body{margin:0;background:#f5f1e8;color:#183d34;font:16px/1.6 system-ui,sans-serif}header,main,footer{max-width:1100px;margin:auto;padding:30px 8%}header{display:flex;align-items:center;justify-content:space-between;gap:20px;border-bottom:1px solid #183d3420}.brand{font-size:23px;font-weight:750;display:flex;gap:12px;align-items:center}.brand img{max-width:110px;max-height:52px;object-fit:contain}a{color:inherit}.hero{padding:80px 0 55px}.tag{font-size:12px;letter-spacing:.15em;text-transform:uppercase;color:${p.color}}h1{font:500 clamp(38px,7vw,76px)/1.08 Georgia,serif;letter-spacing:-.04em;max-width:800px;margin:22px 0}p{max-width:650px;white-space:pre-wrap;color:#54675e}.cta{display:inline-block;background:${p.color};color:white;padding:13px 22px;border-radius:6px;text-decoration:none;margin-top:20px}.details{display:grid;grid-template-columns:1fr 1fr;gap:40px;border-top:1px solid #183d3420;padding:32px 0}h2{font:32px Georgia,serif}footer{border-top:1px solid #183d3420;font-size:13px;color:#54675e}@media(max-width:520px){.hero{padding-top:45px}.details{grid-template-columns:1fr;gap:10px}header{align-items:flex-start}header>a{font-size:13px}}</style></head><body><header><div class="brand">${logo ? `<img src="${logo.data}" alt="Logo ${e(p.name)}">` : ''}<span>${e(p.name)}</span></div><a href="#contact">Contact ↗</a></header><main><section class="hero"><div class="tag">Welkom bij ${e(p.name)}</div><h1>${e(p.headline || 'Een helder verhaal. Een eigen geluid.')}</h1><p>${e(p.description || 'Dit is de eerste richting voor je website. Maak de koptekst en introductie eigen in Vilmos Studio.')}</p><a class="cta" href="${e(contact)}">${e(p.cta || 'Neem contact op')} ↗</a></section><section class="details" id="contact"><div><span class="tag">Laten we kennismaken</span><h2>Goed werk begint<br>met een gesprek.</h2></div><div><p>${p.email ? e(p.email) : 'Voeg in Vilmos Studio je e-mailadres toe, zodat bezoekers contact kunnen opnemen.'}</p>${p.email ? `<a href="${e(contact)}">Stuur een bericht ↗</a>` : ''}</div></section></main><footer>© ${new Date().getFullYear()} ${e(p.name)}</footer></body></html>`;
}
