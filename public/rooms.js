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

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');
const isLecturer = user && user.role === 'lecturer';

function buildingFor(room) {
  if (room.startsWith('LIBRARY')) return 'library';
  if (room.startsWith('SBN') || room.startsWith('SBS')) return 'sees-sbn-sbs';
  if (room.startsWith('SHSS')) return 'shss';
  if (room === 'LTN' || room === 'LTW') return 'lt-halls';
  if (room.startsWith('BA (CC)')) return 'new-admin';
  if (room.startsWith('GS') || room.startsWith('H') || room === 'S3') return 'old-admin';
  return null;
}

function mapLink(room) {
  const bId = buildingFor(room);
  return bId ? `<a href="campus-map.html#${bId}" class="map-link">View on map</a>` : '';
}

searchBtn.addEventListener('click', async function () {
  if (!data) return;

  const day = daySelect.value;
  const slot = slotSelect.value;
  const week = Math.min(Math.max(Number(weekInput.value) || 1, 1), 15);
  weekInput.value = week;

  const busy = data.classes.filter(c =>
    c.day === day && c.slot === slot && (c.weeks === null || c.weeks.includes(week))
  );
  const busyRooms = new Set(busy.map(c => c.room));

  let reservedList = [];
  try {
    const bookedRes = await fetch(`/api/bookings?day=${encodeURIComponent(day)}&week=${week}`);
    const booked = await bookedRes.json();
    reservedList = booked.filter(b => b.slot === slot);
  } catch (err) {
    console.error('Could not load bookings', err);
  }
  const reservedRooms = new Set(reservedList.map(b => b.room));

  const free = data.rooms.filter(r => !busyRooms.has(r) && !reservedRooms.has(r));

  let html = '';

  if (free.length === 0) {
    html += '<p>No free rooms at this time.</p>';
  }

  free.forEach(r => {
    const bookBtn = isLecturer
      ? `<button class="book-btn" data-room="${r}" data-day="${day}" data-slot="${slot}" data-week="${week}">Book</button>`
      : '';
    html += `<div class="room"><h3>${r}</h3><span class="status free">Free</span>${mapLink(r)}${bookBtn}</div>`;
  });

  reservedList.forEach(b => {
    const cancelBtn = (isLecturer && user.id === b.booked_by)
      ? `<button class="cancel-btn" data-id="${b.id}" data-room="${b.room}">Cancel booking</button>`
      : '';
    html += `<div class="room"><h3>${b.room}</h3><span class="status reserved">Reserved</span>${mapLink(b.room)}${cancelBtn}</div>`;
  });

  busy.forEach(c => {
    html += `<div class="room"><h3>${c.room}</h3><p>${c.unit}</p><span class="status reserved">In use</span>${mapLink(c.room)}</div>`;
  });

  results.innerHTML = html;
});

results.addEventListener('click', async function (e) {
  const bookBtn = e.target.closest('.book-btn');
  const cancelBtn = e.target.closest('.cancel-btn');

  if (bookBtn) {
    const reason = prompt('Reason for booking ' + bookBtn.dataset.room + ':');
    if (!reason || reason.trim() === '') return;

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          room: bookBtn.dataset.room,
          day: bookBtn.dataset.day,
          slot: bookBtn.dataset.slot,
          week: Number(bookBtn.dataset.week),
          reason: reason.trim()
        })
      });
      const result = await response.json();
      alert(response.ok ? 'Room booked.' : result.error);
      searchBtn.click();
    } catch (err) {
      alert('Cannot reach the server.');
    }
  }

  if (cancelBtn) {
    if (!confirm('Cancel your booking for ' + cancelBtn.dataset.room + '?')) return;

    try {
      const response = await fetch('/api/bookings/' + cancelBtn.dataset.id, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const result = await response.json();
      alert(response.ok ? 'Booking cancelled.' : result.error);
      searchBtn.click();
    } catch (err) {
      alert('Cannot reach the server.');
    }
  }
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