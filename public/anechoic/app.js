const start = Date.parse(document.querySelector('#start').dateTime);
const end = Date.parse('2026-12-01T00:00:00+01:00');
const clock = document.querySelector('.clock');
const heading = document.querySelector('#countdown-title');
const launchDate = document.querySelector('#launch-date');
const liveOffer = document.querySelector('#live-offer');
const digits = [...clock.querySelectorAll('b')];

function updateClock() {
  const now = Date.now();
  const seconds = Math.max(0, Math.ceil((start - now) / 1000));
  clock.hidden = now >= start;
  launchDate.hidden = now >= start;
  liveOffer.hidden = now < start || now >= end;
  heading.textContent = now < start ? 'Countdown to liftoff'
    : now < end ? 'We’ve landed on Planet Deal' : 'Anechoic Friday has ended';
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

const areaButtons = [...document.querySelectorAll('.area-buttons button')];
let selectedArea = '';
const search = document.querySelector('#course-search');
const results = document.querySelector('#results');
const courses = [...document.querySelectorAll('.courses li')];

function filterCourses() {
  const query = search.value.trim().toLowerCase();
  let count = 0;
  for (const course of courses) {
    const matchesArea = !selectedArea || course.dataset.area === selectedArea;
    const matchesSearch = [...course.querySelectorAll('h3, small')].some(field => field.textContent.toLowerCase().includes(query));
    course.hidden = !matchesArea || !matchesSearch;
    if (!course.hidden) count++;
  }
  results.textContent = count === 0 ? 'No courses found' : `${count} ${count === 1 ? 'result' : 'results'}`;
}

search.addEventListener('input', filterCourses);
for (const button of areaButtons) {
  button.addEventListener('click', () => {
    selectedArea = button.dataset.area;
    for (const option of areaButtons) {
      option.setAttribute('aria-pressed', String(option === button));
    }
    filterCourses();
  });
}
filterCourses();
document.querySelector('.catalog-controls').hidden = false;
