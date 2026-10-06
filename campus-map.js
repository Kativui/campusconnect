const zones = [
  { name: 'Main Campus Core', x: 30, y: 30, w: 400, h: 300 },
  { name: 'Student Life', x: 450, y: 30, w: 400, h: 230 },
  { name: 'Outlying Schools', x: 30, y: 370, w: 820, h: 180 },
  { name: 'Hostels', x: 30, y: 580, w: 820, h: 180 },
  { name: 'Sports & Recreation', x: 30, y: 790, w: 820, h: 140 },
];

const buildings = [
  
  { id: 'old-admin', name: 'Old Administration Block', desc: 'Admissions Office, Room 1. Registrar and general administration.', x: 50, y: 70, w: 170, h: 55 },
  { id: 'lt-halls', name: 'LTW & LTN Hall', desc: 'Large lecture theatres. LTN is Lecture Theatre North.', x: 240, y: 70, w: 170, h: 55 },
  { id: 'new-admin', name: 'New Administration Block', desc: 'Newer administration offices.', x: 50, y: 140, w: 170, h: 55 },
  { id: 'pl-block', name: 'PL Block', desc: 'PL Block classrooms.', x: 240, y: 140, w: 170, h: 55 },
  { id: 'cs-lab', name: 'Computer Science Lab', desc: 'Computer Science teaching lab, near New Administration Block.', x: 50, y: 210, w: 170, h: 55 },
  { id: 's3-s2blocks', name: 'S3-S2blocks', desc: 'Classroom S3, right next to PL Block.', x: 240, y: 210, w: 170, h: 55 },

  
  { id: 'dining', name: 'Student Dining Area', desc: 'Main campus dining hall.', x: 470, y: 70, w: 170, h: 50 },
  { id: 'common-room', name: 'Common Room', desc: "Student's common room.", x: 660, y: 70, w: 170, h: 50 },
  { id: 'health', name: 'Health Unit', desc: 'On-campus clinic for outpatient consultations. Complicated cases referred to Kilifi County Referral Hospital.', x: 470, y: 135, w: 170, h: 50 },
  { id: 'restaurant', name: 'Red Buffalo Restaurant', desc: 'Campus restaurant, just off the main road into campus.', x: 660, y: 135, w: 170, h: 50 },
  { id: 'botanical', name: 'Botanical Garden', desc: 'Established 2011 for research, education, and conservation. Sits near the Common Room.', x: 470, y: 200, w: 360, h: 50 },

  
  { id: 'library', name: 'New Library Block', desc: 'Main library, including LIBRARY GFE001, GFE 001B-F, and GFW002 rooms. Sits apart from the main cluster, near Kilifi-Ganze Road.', x: 50, y: 410, w: 250, h: 50 },
  { id: 'shss', name: 'School of Humanities and Social Sciences', desc: 'SHSS academic block, north of the main cluster.', x: 320, y: 410, w: 250, h: 50 },
  { id: 'sasa', name: 'School of Agriculture (SASA)', desc: 'School of Agricultural Sciences and Agribusiness, west of the Humanities block.', x: 590, y: 410, w: 250, h: 50 },
  { id: 'sees-sbn-sbs', name: 'School of Environmental & Earth Sciences (SBN/SBS)', desc: 'Houses the SBN and SBS classroom blocks.', x: 50, y: 470, w: 250, h: 50 },
  { id: 'ivet', name: 'TVET School (PF Block)', desc: 'Technical and vocational education block, west of the Environmental Sciences building.', x: 320, y: 470, w: 250, h: 50 },

  
  { id: 'hostel1', name: 'Hostel 1', desc: 'On-campus student accommodation.', x: 50, y: 620, w: 170, h: 50 },
  { id: 'hostel2', name: 'Hostel 2', desc: 'On-campus student accommodation.', x: 240, y: 620, w: 170, h: 50 },
  { id: 'hostel3', name: 'Hostel 3', desc: 'On-campus student accommodation.', x: 430, y: 620, w: 170, h: 50 },
  { id: 'hostel4', name: 'Hostel 4', desc: 'On-campus student accommodation, near Old Administration Block.', x: 620, y: 620, w: 170, h: 50 },
  { id: 'hostel5', name: 'Hostel 5', desc: 'On-campus student accommodation, near Old Administration Block.', x: 50, y: 690, w: 170, h: 50 },
  { id: 'runda-hostel6', name: 'Runda Hostel 6 (Boys)', desc: 'On-campus student accommodation.', x: 240, y: 690, w: 250, h: 50 },


  { id: 'football-pitch', name: 'Football Pitch', desc: 'Main football pitch.', x: 50, y: 830, w: 180, h: 60 },
  { id: 'graduation-square', name: 'Graduation Square', desc: 'Outdoor space used for graduation ceremonies.', x: 250, y: 830, w: 180, h: 60 },
  { id: 'handball-pitch', name: 'Handball Pitch', desc: 'Handball court, next to graduation square.', x: 450, y: 830, w: 180, h: 60 },
  { id: 'basketball-court', name: 'Basketball Court', desc: 'Outdoor basketball court.', x: 650, y: 830, w: 180, h: 60 },
];

const mapContainer = document.getElementById('mapContainer');
const mapInfo = document.getElementById('mapInfo');

let svg = '<svg viewBox="0 0 900 970" style="width: 100%; height: auto;">';

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