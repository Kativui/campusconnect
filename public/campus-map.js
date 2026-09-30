const zones = [
  { name: 'Academic Core', x: 20, y: 20, w: 340, h: 320 },
  { name: 'Student Life', x: 380, y: 20, w: 340, h: 260 },
  { name: 'Schools (Outlying)', x: 20, y: 360, w: 700, h: 180 },
];

const buildings = [
  { id: 'old-admin', name: 'Old Administration Block', desc: 'Admissions Office, Room 1. Registrar and general administration.', x: 40, y: 60, w: 140, h: 55 },
  { id: 'lt-halls', name: 'LTW & LTN Halls', desc: 'Large lecture theatres LTW and LTN.', x: 200, y: 60, w: 140, h: 55 },
  { id: 'new-admin', name: 'New Administration Block', desc: 'Newer administration offices.', x: 40, y: 130, w: 140, h: 55 },
  { id: 'pl-block', name: 'PL Block', desc: 'PL Block classrooms.', x: 200, y: 130, w: 140, h: 55 },
  { id: 'library', name: 'New Library Block', desc: 'Main library, including LIBRARY GFE001, GFE 001B-F, and GFW002 rooms.', x: 40, y: 200, w: 300, h: 55 },
  { id: 'sbn-sbs', name: 'SBN / SBS Complex', desc: 'Multi-story business/sciences building. Room numbers indicate floor: 001-099 ground floor, 101-199 first floor, 201-299 second floor, 301-399 third floor.', x: 40, y: 270, w: 220, h: 55 },

  { id: 'dining', name: 'Student Dining Area', desc: 'Main campus dining hall.', x: 400, y: 60, w: 140, h: 50 },
  { id: 'common-room', name: 'Common Room', desc: 'Student common room.', x: 560, y: 60, w: 140, h: 50 },
  { id: 'hostels', name: 'Hostels 4 & 5', desc: 'On-campus student accommodation blocks.', x: 400, y: 125, w: 140, h: 50 },
  { id: 'health', name: 'Health Unit', desc: 'On-campus clinic for outpatient consultations. Complicated cases referred to Kilifi County Referral Hospital.', x: 560, y: 125, w: 140, h: 50 },
  { id: 'restaurant', name: 'Red Buffalo Restaurant', desc: 'Campus restaurant.', x: 400, y: 190, w: 140, h: 50 },
  { id: 'sports', name: 'Graduation Square & Football Pitch', desc: 'Outdoor events space and football pitch.', x: 560, y: 190, w: 140, h: 50 },

  { id: 'shss', name: 'School of Humanities and Social Sciences', desc: 'SHSS academic block, north of the main cluster.', x: 40, y: 410, w: 160, h: 55 },
  { id: 'sasa', name: 'School of Agriculture (SASA)', desc: 'School of Agricultural Sciences and Agribusiness.', x: 220, y: 410, w: 160, h: 55 },
  { id: 'sees', name: 'School of Environmental & Earth Sciences', desc: 'SEES academic block.', x: 400, y: 410, w: 160, h: 55 },
  { id: 'botanical', name: 'Botanical Garden', desc: 'Established 2011 for research, education, and conservation.', x: 580, y: 410, w: 140, h: 55 },
];

const mapContainer = document.getElementById('mapContainer');
const mapInfo = document.getElementById('mapInfo');

let svg = '<svg viewBox="0 0 750 560" style="width: 100%; height: auto;">';

zones.forEach(z => {
  svg += `
    <rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}"
      fill="#f4f6f9" stroke="#ccc" stroke-width="1" stroke-dasharray="4" rx="10" />
    <text x="${z.x + 10}" y="${z.y + 16}" font-size="12" fill="#888" font-weight="bold">
      ${z.name}
    </text>
  `;
});

buildings.forEach(b => {
  svg += `
    <rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}"
      fill="#e3ecfb" stroke="#0b3d91" stroke-width="2" rx="8"
      class="building" data-id="${b.id}" style="cursor: pointer;" />
    <text x="${b.x + b.w / 2}" y="${b.y + b.h / 2}"
      text-anchor="middle" dominant-baseline="middle"
      font-size="11" fill="#0b3d91" style="pointer-events: none;">
      ${b.name.split(' ').slice(0, 3).join(' ')}
    </text>
  `;
});

svg += '</svg>';
mapContainer.innerHTML = svg;

mapContainer.addEventListener('click', function (e) {
  const rect = e.target.closest('.building');
  if (!rect) return;
  const id = rect.dataset.id;
  const building = buildings.find(b => b.id === id);
  document.querySelectorAll('.building').forEach(el => el.classList.remove('selected'));
  rect.classList.add('selected');
  mapInfo.innerHTML = `<h3>${building.name}</h3><p>${building.desc}</p>`;
});

const targetId = window.location.hash.slice(1);
if (targetId) {
  const targetRect = document.querySelector(`.building[data-id="${targetId}"]`);
  if (targetRect) {
    targetRect.dispatchEvent(new Event('click', { bubbles: true }));
    targetRect.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}