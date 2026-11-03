// Set only after the owner supplies the public contact address.
const contactEmail = 'info@vilmos.nl';
const form = document.getElementById('contact-form');
const status = document.getElementById('contact-status');
document.getElementById('year').textContent = new Date().getFullYear();
if (contactEmail) {
  document.getElementById('direct-contact').hidden = false;
  const link = document.getElementById('email-link'); link.textContent = contactEmail; link.href = 'mailto:' + contactEmail;
} else {
  document.getElementById('contact-submit').disabled = true;
  document.getElementById('contact-explanation').textContent = 'Dit is een eerste concept. Het contactadres wordt nog toegevoegd; berichten versturen is nog niet beschikbaar.';
}
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => { document.getElementById('service').value = link.dataset.service; }));
form.addEventListener('submit', event => {
  event.preventDefault(); if (!contactEmail || !form.reportValidity()) return;
  const values = new FormData(form);
  const body = `Hoi Vilmos,\n\n${values.get('message')}\n\nIk zoek hulp bij: ${values.get('service')}\n\nGroet,\n${values.get('name')}\n${values.get('email')}`;
  const query = new URLSearchParams({ subject: `Kennismaken — ${values.get('service')}`, body });
  window.location.href = `mailto:${contactEmail}?${query.toString().replaceAll('+', '%20')}`;
  status.hidden = false; status.textContent = 'Je bericht staat klaar voor je mailprogramma. Nog niets verzonden: controleer het bericht en verstuur het daar. Opent er niets? Gebruik dan het e-mailadres hiernaast.';
});
