const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');
const canPost = user && (user.role === 'admin' || user.role === 'org');

const list = document.getElementById('announcementList');
const postBox = document.getElementById('postBox');
const postTitle = document.getElementById('postTitle');
const postBody = document.getElementById('postBody');
const postBtn = document.getElementById('postBtn');
const postMessage = document.getElementById('postMessage');

if (canPost) postBox.style.display = 'block';

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

async function loadAnnouncements() {
  try {
    const response = await fetch('/api/announcements');
    const items = await response.json();

    list.innerHTML = items.map(a => {
      const isOrg = a.poster_role === 'org';
      const tag = isOrg
        ? '<span class="tag club">Student Organization</span>'
        : '<span class="tag">Administration</span>';
      return `<article class="announcement">
        ${tag}
        <h3>${escapeHtml(a.title)}</h3>
        <p>${escapeHtml(a.body)}</p>
        <small>Posted by ${escapeHtml(a.posted_by)} on ${formatDate(a.created_at)}</small>
      </article>`;
    }).join('');
  } catch (err) {
    console.error('Could not load announcements', err);
  }
}

postBtn.addEventListener('click', async function () {
  const title = postTitle.value.trim();
  const body = postBody.value.trim();

  if (title === '' || body === '') {
    postMessage.textContent = 'Enter a title and a message.';
    postMessage.className = 'error';
    return;
  }

  try {
    const response = await fetch('/api/announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ title, body })
    });
    const data = await response.json();

    if (!response.ok) {
      postMessage.textContent = data.error;
      postMessage.className = 'error';
      return;
    }

    postMessage.textContent = 'Announcement posted.';
    postMessage.className = 'success';
    postTitle.value = '';
    postBody.value = '';
    loadAnnouncements();
  } catch (err) {
    postMessage.textContent = 'Cannot reach the server.';
    postMessage.className = 'error';
  }
});

loadAnnouncements();