let data;

fetch('rooms.json')
  .then(res => res.json())
  .then(json => {
    data = json;
  });

const daySelect = document.getElementById('daySelect');
const slotSelect = document.getElementById('slotSelect');
const weekInput = document.getElementById('weekInput');
const searchBtn = document.getElementById('searchBtn');
const results = document.getElementById('results');
const unitSearch = document.getElementById('unitSearch');
const unitSearchBtn = document.getElementById('unitSearchBtn');
const unitResults = document.getElementById('unitResults');

function buildingFor(room) {
  if (room.startsWith('LIBRARY')) return 'library';
  if (room.startsWith('SBN') || room.startsWith('SBS')) return 'sbn-sbs';
  if (room.startsWith('SHSS')) return 'shss';
  if (room === 'LTN' || room === 'LTW') return 'lt-halls';
  if (room.startsWith('BA (CC)')) return 'new-admin';
  if (room.startsWith('GS') || room.startsWith('H') || room === 'S3') return 'old-admin';
  return null;
}

searchBtn.addEventListener('click', function () {
  const day = daySelect.value;
  const slot = slotSelect.value;
  const week = Math.min(Math.max(Number(weekInput.value) || 1, 1), 15);
  weekInput.value = week;

  const busy = data.classes.filter(c =>
    c.day === day && c.slot === slot && (c.weeks === null || c.weeks.includes(week))
  );

  const busyRooms = new Set(busy.map(c => c.room));
  const free = data.rooms.filter(r => !busyRooms.has(r));

  results.innerHTML = '';

  if (free.length === 0) {
    results.innerHTML = '<p>No free rooms at this time.</p>';
  }

  free.forEach(r => {
    const bId = buildingFor(r);
    const link = bId ? `<a href="campus-map.html#${bId}" class="map-link">View on map</a>` : '';
    results.innerHTML += `<div class="room"><h3>${r}</h3><span class="status free">Free</span>${link}</div>`;
  });

  busy.forEach(c => {
    const bId = buildingFor(c.room);
    const link = bId ? `<a href="campus-map.html#${bId}" class="map-link">View on map</a>` : '';
    results.innerHTML += `<div class="room"><h3>${c.room}</h3><p>${c.unit}</p><span class="status reserved">In use</span>${link}</div>`;
  });
});

unitSearchBtn.addEventListener('click', function () {
  const term = unitSearch.value.trim().toUpperCase();
  unitResults.innerHTML = '';

  if (term === '') {
    unitResults.innerHTML = '<p>Type a unit code to search.</p>';
    return;
  }

  const day = daySelect.value;
  const slot = slotSelect.value;
  const week = Number(weekInput.value);

  const matches = data.classes.filter(c => c.unit.includes(term));

  if (matches.length === 0) {
    unitResults.innerHTML = '<p>No unit found matching that code.</p>';
    return;
  }

  matches.forEach(c => {
    const isNow = c.day === day && c.slot === slot && (c.weeks === null || c.weeks.includes(week));
    const status = isNow
      ? `<span class="status free">Happening now</span>`
      : `<span class="status reserved">${c.day}, ${c.slot}</span>`;
    unitResults.innerHTML += `<div class="room"><h3>${c.unit}</h3><p>${c.room}</p>${status}</div>`;
  });
});

const now = new Date();
const semesterStart = new Date(2026, 7, 31);
const msPerWeek = 7 * 24 * 60 * 60 * 1000;
const weekNumber = Math.floor((now - semesterStart) / msPerWeek) + 1;
weekInput.value = Math.min(Math.max(weekNumber, 1), 15);

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
daySelect.value = dayNames[now.getDay() - 1] || 'Monday';

const hour = now.getHours();
if (hour >= 16) slotSelect.value = '4pm-7pm';
else if (hour >= 13) slotSelect.value = '1pm-4pm';
else if (hour >= 10) slotSelect.value = '10am-1pm';
else slotSelect.value = '7am-10am';