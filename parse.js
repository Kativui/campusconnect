const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('data/timetable.html', 'utf8');
const $ = cheerio.load(html);
function parseCell(cell) {
cell.find('br').replaceWith('\n');
const lines = cell.text().split('\n').map(l => l.trim()).filter(l => l !== '');
const codeIndex = lines.findIndex(l => /^[A-Z]{3} [A-Z]\d{3}$/.test(l));
const unit = lines[codeIndex];
const lecturer = lines[codeIndex + 1];
const roomLine = lines[codeIndex + 2];
  if (codeIndex === -1 || !roomLine) return null;
const beforePhysical = roomLine.split('PHYSICAL')[0];
const room = beforePhysical.replace(/[-\s]+$/, '').trim();
const weekMatch = roomLine.match(/PHYSICAL in Week ([\d,]+)/);
const weeks = weekMatch ? weekMatch[1].split(',').map(Number) : null;
  return { unit, room, weeks };
}
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const slots = ['7am-10am', '10am-1pm', '1pm-4pm', '4pm-7pm'];
const all = [];
$('table').each((i, table) => {
  $(table).find('tr').each((j, row) => {
    const cells = $(row).find('td, th');
    const day = cells.eq(0).text().trim();
    if (!days.includes(day)) return;
        slots.forEach((slot, k) => {
      const result = parseCell(cells.eq(k + 1));
      if (result) all.push({ day, slot, ...result });
    });

  });
});
const unique = new Map();
all.forEach(c => {
  const key = [c.day, c.slot, c.room, c.weeks ? c.weeks.join(',') : 'all'].join('|');
  unique.set(key, c);
});
const classes = [...unique.values()];
const rooms = [...new Set(classes.map(c => c.room))].sort();
const output = { rooms, classes };
fs.writeFileSync('public/rooms.json', JSON.stringify(output));
console.log('Saved', classes.length, 'classes and', rooms.length, 'rooms');