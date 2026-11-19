const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

const unitInput = document.getElementById('unitInput');
const openBtn = document.getElementById('openBtn');
const boardMessage = document.getElementById('boardMessage');
const board = document.getElementById('board');
const boardTitle = document.getElementById('boardTitle');
const questionBody = document.getElementById('questionBody');
const askBtn = document.getElementById('askBtn');
const thread = document.getElementById('thread');

let currentUnit = '';

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(value) {
  return new Date(value).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  });
}

function senderLabel(m) {
  const badge = m.sender_role === 'lecturer' ? ' <span class="tag">Lecturer</span>' : '';
  return `${escapeHtml(m.sender)}${badge}`;
}

async function api(method, path, body) {
  const response = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
    return null;
  }
  return { ok: response.ok, data: await response.json() };
}

async function loadBoard() {
  const result = await api('GET', '/api/messages?unit=' + encodeURIComponent(currentUnit));
  if (!result) return;
  if (!result.ok) {
    boardMessage.textContent = result.data.error;
    boardMessage.className = 'error';
    return;
  }

  const messages = result.data;
  const questions = messages.filter(m => m.parent_id === null);

  if (questions.length === 0) {
    thread.innerHTML = '<p>No questions yet. Be the first to ask.</p>';
    return;
  }

  thread.innerHTML = questions.map(q => {
    const replies = messages.filter(m => m.parent_id === q.id).map(r =>
      `<div class="reply">
        <p>${escapeHtml(r.body)}</p>
        <small>${senderLabel(r)} · ${formatDate(r.created_at)}</small>
      </div>`
    ).join('');

    return `<article class="announcement">
      <h3>${escapeHtml(q.body)}</h3>
      <small>${senderLabel(q)} · ${formatDate(q.created_at)}</small>
      <div class="replies">${replies}</div>
      <div class="reply-box">
        <input type="text" class="reply-input" placeholder="Write a reply">
        <button class="reply-btn" data-id="${q.id}">Reply</button>
      </div>
    </article>`;
  }).join('');
}

openBtn.addEventListener('click', function () {
  const unit = unitInput.value.trim().toUpperCase();
  if (unit === '') {
    boardMessage.textContent = 'Enter a unit code.';
    boardMessage.className = 'error';
    return;
  }
  currentUnit = unit;
  boardMessage.textContent = '';
  boardTitle.textContent = 'Board: ' + unit;
  board.style.display = 'block';
  loadBoard();
});

askBtn.addEventListener('click', async function () {
  const body = questionBody.value.trim();
  if (body === '') return;

  const result = await api('POST', '/api/messages', { unit_code: currentUnit, body });
  if (!result) return;
  if (!result.ok) {
    alert(result.data.error);
    return;
  }
  questionBody.value = '';
  loadBoard();
});

thread.addEventListener('click', async function (e) {
  const btn = e.target.closest('.reply-btn');
  if (!btn) return;

  const input = btn.parentElement.querySelector('.reply-input');
  const body = input.value.trim();
  if (body === '') return;

  const result = await api('POST', '/api/messages', {
    unit_code: currentUnit,
    body,
    parent_id: Number(btn.dataset.id)
  });
  if (!result) return;
  if (!result.ok) {
    alert(result.data.error);
    return;
  }
  loadBoard();
});