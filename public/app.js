import { createProject, validateProject, renderWebsite, slug, MAX_FILE_SIZE, MAX_TOTAL_SIZE } from './studio.js';
import { buildBriefing, buildHandoff } from './handoff.js';
const $ = id => document.getElementById(id);
const KEY = 'vilmos-studio-v1';
let projects = [], selected = null, timer;
function notify(text) { $('toast').textContent = text; $('toast').hidden = false; clearTimeout(timer); timer = setTimeout(() => $('toast').hidden = true, 5500); }
try {
  const saved = JSON.parse(localStorage.getItem(KEY) || '{"projects":[]}');
  projects = saved.projects.map(p => ({ ...validateProject(p), id: typeof p.id === 'string' ? p.id : crypto.randomUUID() }));
  selected = projects.some(p => p.id === saved.selected) ? saved.selected : projects[0]?.id;
} catch { notify('Opgeslagen projecten konden niet worden geladen. De bestaande opslag is niet overschreven.'); }
const current = () => projects.find(p => p.id === selected);
function save() {
  try { localStorage.setItem(KEY, JSON.stringify({ projects, selected })); return true; }
  catch { notify('Browseropslag is vol of niet beschikbaar. Exporteer je project om je werk te bewaren.'); return false; }
}
function makeProject(name) { const p = createProject(name, crypto.randomUUID()); projects.unshift(p); selected = p.id; save(); render(); return p; }
function button(text, handler, className = '') { const el = document.createElement('button'); el.textContent = text; el.className = className; el.type = 'button'; el.addEventListener('click', handler); return el; }
function renderList() {
  $('project-list').replaceChildren();
  if (!projects.length) { const p = document.createElement('p'); p.className = 'no-projects'; p.textContent = 'Hier komen je projecten.'; $('project-list').append(p); }
  for (const p of projects) { const b = button('↗  ' + p.name, () => { selected = p.id; save(); render(); }, 'project-link' + (selected === p.id ? ' selected' : '')); if (selected === p.id) b.setAttribute('aria-current', 'page'); $('project-list').append(b); }
}
function renderMessages() {
  const p = current(); $('messages').replaceChildren();
  const messages = p?.messages.length ? p.messages : [{ role: 'assistant', text: 'Welkom in je werkruimte. Vertel wat je wilt maken of verbeteren en voeg eventueel bestanden toe. Gebruik daarna ‘Verder bouwen in je chat’ om je briefing mee te nemen. Het websitesjabloon rechts is alleen een optioneel beginpunt.' }];
  for (const m of messages) { const el = document.createElement('div'); el.className = 'message ' + m.role; const label = document.createElement('span'); label.className = 'message-label'; label.textContent = m.role === 'user' ? 'JIJ' : 'VILMOS STUDIO · UITLEG'; const text = document.createElement('p'); text.textContent = m.text; el.append(label, text); $('messages').append(el); }
  $('messages').scrollTop = $('messages').scrollHeight;
}
function renderFiles() {
  $('attachments').replaceChildren();
  for (const f of current()?.files || []) {
    const chip = document.createElement('div'); chip.className = 'file-chip';
    if (f.kind === 'image') { const img = document.createElement('img'); img.src = f.data; img.alt = ''; chip.append(img); }
    const name = document.createElement('span'); name.textContent = f.name; chip.append(name);
    const remove = button('×', () => { const p = current(); p.files = p.files.filter(x => x.id !== f.id); save(); renderFiles(); updatePreview(); }); remove.setAttribute('aria-label', 'Verwijder ' + f.name); chip.append(remove); $('attachments').append(chip);
  }
}
function updatePreview() {
  const p = current(); const generated = !!p?.generated;
  $('empty-preview').hidden = generated; $('frame-wrap').hidden = !generated; $('download').disabled = !generated;
  $('generate').disabled = !p; $('generate').textContent = generated ? 'Vernieuw concept ↗' : 'Maak sjabloonconcept ↗';
  $('preview-status').textContent = generated ? 'Sjabloon' : 'Nog leeg'; $('address').textContent = p ? slug(p.name) + ' · concept' : 'Je eerste concept';
  if (generated) $('preview').srcdoc = renderWebsite(p);
  else $('preview').removeAttribute('srcdoc');
}
function render() {
  const p = current(); renderList(); renderMessages(); renderFiles();
  $('project-name').textContent = p?.name || 'Nieuw project'; $('project-settings').hidden = !p; $('handoff-panel').hidden = !p; $('welcome').hidden = !!p;
  for (const field of ['name', 'headline', 'description', 'cta', 'email', 'color']) $(field).value = p?.[field] || (field === 'color' ? '#c65d38' : '');
  updatePreview();
}
$('new-project').onclick = () => { $('new-name').value = ''; $('new-brief').value = ''; $('new-dialog').showModal(); $('new-name').focus(); };
$('cancel-new').onclick = () => $('new-dialog').close();
$('new-form').onsubmit = event => { event.preventDefault(); const name = $('new-name').value.trim(); if (!name) return; const p = makeProject(name); const brief = $('new-brief').value.trim(); if (brief) { p.messages.push({ role: 'user', text: brief }); save(); renderMessages(); } $('new-dialog').close(); $('prompt').focus(); };
document.querySelectorAll('[data-prompt]').forEach(b => b.onclick = () => { $('prompt').value = b.dataset.prompt; $('prompt').focus(); });
$('chat-form').onsubmit = event => {
  event.preventDefault(); const text = $('prompt').value.trim(); if (!text) return;
  const p = current() || makeProject('Mijn nieuwe website');
  if (p.messages.length >= 198) { notify('Dit project heeft 200 berichten. Start een nieuw project of exporteer je werk.'); return; }
  p.messages.push({ role: 'user', text }, { role: 'assistant', text: 'Je briefing is bewaard. Voeg eventueel je logo, beelden of teksten toe. Klaar? Klik hieronder op ‘Verder bouwen in je chat’. Daar kunnen we je project uitwerken. Het sjabloon rechts is optioneel en voert je chatopdrachten niet uit.' });
  p.updatedAt = new Date().toISOString(); $('prompt').value = ''; save(); renderMessages();
};
for (const key of ['name', 'headline', 'description', 'cta', 'email', 'color']) $(key).addEventListener('input', () => {
  const p = current(); if (!p) return; p[key] = $(key).value; p.updatedAt = new Date().toISOString(); save();
  if (key === 'name') { $('project-name').textContent = p.name; renderList(); }
  updatePreview();
});
$('generate').onclick = () => { const p = current(); if (!p) return; if (!$('email').checkValidity()) { $('email').reportValidity(); return; } p.generated = true; save(); updatePreview(); };
$('upload').onclick = () => $('file-input').click();
$('file-input').onchange = async event => {
  const p = current() || makeProject('Mijn nieuwe website');
  for (const file of event.target.files) {
    if (p.files.length >= 20) { notify('Maximaal 20 bestanden per project.'); break; }
    if (file.size > MAX_FILE_SIZE) { notify(file.name + ' is te groot. Maximaal 2 MB per bestand.'); continue; }
    const kind = ['image/png', 'image/jpeg', 'image/webp'].includes(file.type) ? 'image' : /\.(txt|md)$/i.test(file.name) ? 'text' : null;
    if (!kind) { notify('Gebruik PNG, JPG, WebP, TXT of MD.'); continue; }
    try {
      const data = kind === 'text' ? await file.text() : await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
      if (p.files.reduce((n, f) => n + f.data.length, 0) + data.length > MAX_TOTAL_SIZE) { notify('Maximaal 4 MB aan bestandsinhoud per project.'); continue; }
      const f = { id: crypto.randomUUID(), name: file.name, kind, size: file.size, data };
      validateProject({ ...p, files: [...p.files, f] }); p.files.push(f); save();
    } catch { notify('Bestand kon niet worden toegevoegd: ' + file.name); }
  }
  event.target.value = ''; renderFiles(); updatePreview();
};
function download(data, type, filename) { const url = URL.createObjectURL(new Blob([data], { type })); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
$('export-project').onclick = () => { const p = current(); if (p) download(JSON.stringify({ version: 1, project: p }, null, 2), 'application/json', slug(p.name) + '.vilmos.json'); };
$('handoff').onclick = () => {
  const p = current(); if (!p) return;
  $('handoff-briefing').value = buildBriefing(p);
  $('handoff-summary').textContent = `${p.name} · ${p.messages.filter(m => m.role === 'user').length} briefing(en) · ${p.files.length} bestand(en)`;
  $('handoff-dialog').showModal();
};
$('close-handoff').onclick = () => $('handoff-dialog').close();
$('download-handoff').onclick = () => { const p = current(); if (p) { download(buildHandoff(p), 'application/zip', slug(p.name) + '-overdracht.zip'); notify('Overdracht gedownload. Pak het bestand uit en voeg de briefing en bijlagen toe aan deze chat.'); } };
$('copy-briefing').onclick = async () => {
  try { await navigator.clipboard.writeText($('handoff-briefing').value); notify('Briefing gekopieerd. Voeg beeldbestanden apart toe of gebruik het overdrachtpakket.'); }
  catch { $('handoff-briefing').focus(); $('handoff-briefing').select(); notify('Kopiëren is niet beschikbaar. De briefing is geselecteerd; kopieer hem zelf.'); }
};
$('download').onclick = () => { const p = current(); if (p?.generated) download(renderWebsite(p), 'text/html', slug(p.name) + '.html'); };
$('import-project').onclick = () => $('import-input').click();
$('import-input').onchange = async event => {
  try { const file = event.target.files[0]; if (!file) return; if (file.size > 6 * 1024 * 1024) throw new Error('Projectbestand is te groot.'); const parsed = JSON.parse(await file.text()); if (parsed.version !== 1) throw new Error('Onbekende projectversie.'); const p = { ...validateProject(parsed.project), id: crypto.randomUUID() }; projects.unshift(p); selected = p.id; save(); render(); notify('Project geïmporteerd.'); }
  catch (error) { notify(error.message || 'Project kon niet worden geïmporteerd.'); }
  event.target.value = '';
};
$('delete-project').onclick = () => { const p = current(); if (!p || !confirm('Project “' + p.name + '” inclusief berichten en bestanden verwijderen?')) return; projects = projects.filter(x => x.id !== p.id); selected = projects[0]?.id; save(); render(); };
for (const mode of ['desktop', 'mobile']) $(mode).onclick = () => { $('frame-wrap').classList.toggle('mobile', mode === 'mobile'); for (const id of ['desktop', 'mobile']) { $(id).classList.toggle('active', mode === id); $(id).setAttribute('aria-pressed', String(mode === id)); } };
render();
