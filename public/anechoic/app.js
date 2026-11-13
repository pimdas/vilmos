const start = Date.parse(document.querySelector('#start').dateTime);
const end = Date.parse('2026-12-01T00:00:00+01:00');
const clock = document.querySelector('.clock');
const heading = document.querySelector('#countdown-title');
const digits = [...clock.querySelectorAll('b')];

function updateClock() {
  const now = Date.now();
  const seconds = Math.max(0, Math.ceil((start - now) / 1000));
  clock.hidden = now >= start;
  heading.textContent = now < start ? 'The deal starts in'
    : now < end ? 'Anechoic Friday is on' : 'Anechoic Friday has ended';
  const parts = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24,
    Math.floor(seconds / 60) % 60, seconds % 60];
  parts.forEach((value, index) => {
    digits[index].textContent = String(value).padStart(2, '0');
  });
}

updateClock();
if (Date.now() < end) {
  const timer = setInterval(() => {
    updateClock();
    if (Date.now() >= end) clearInterval(timer);
  }, 1000);
}

const area = document.querySelector('#area');
const results = document.querySelector('#results');
const courses = [...document.querySelectorAll('.courses li')];

function filterCourses() {
  let count = 0;
  for (const course of courses) {
    course.hidden = Boolean(area.value) && course.dataset.area !== area.value;
    if (!course.hidden) count++;
  }
  results.textContent = `${count} ${count === 1 ? 'result' : 'results'}`;
}

area.addEventListener('change', filterCourses);
filterCourses();
document.querySelector('.catalog-controls').hidden = false;
