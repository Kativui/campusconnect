const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('slideDots');
let current = 0;

slides.forEach((_, i) => {
  const dot = document.createElement('span');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => showSlide(i));
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.slide-dots span');

function showSlide(index) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = index;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

setInterval(() => {
  showSlide((current + 1) % slides.length);
}, 4000);

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function loadLatestAnnouncement() {
  const box = document.getElementById('latestAnnouncement');
  if (!box) return;

  try {
    const response = await fetch('/api/announcements');
    const items = await response.json();
    if (!response.ok || items.length === 0) return;

    const a = items[0];
    const tag = a.poster_role === 'org'
      ? '<span class="tag club">Student Organization</span>'
      : '<span class="tag">Administration</span>';
    const date = new Date(a.created_at).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });

    box.innerHTML = `<div class="announcement">
      ${tag}
      <h3>${escapeHtml(a.title)}</h3>
      <p>${escapeHtml(a.body)}</p>
      <small>Posted by ${escapeHtml(a.posted_by)} on ${date}</small>
    </div>`;
  } catch (err) {
    console.error('Could not load the latest announcement', err);
  }
}

loadLatestAnnouncement();