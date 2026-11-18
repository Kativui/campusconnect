async function call(method, path, body, token) {
  const res = await fetch('http://localhost:3000' + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: 'Bearer ' + token }) },
    body: body ? JSON.stringify(body) : undefined
  });
  return res.json();
}

async function run() {
  const post = { title: 'Orientation week', body: 'Freshers report to the main hall at 9am.' };

  console.log('1. No token:', await call('POST', '/api/announcements', post));

  const student = await call('POST', '/api/login', { email: 'test@pwani.co.ke', password: 'password123' });
  console.log('2. Student:', await call('POST', '/api/announcements', post, student.token));

  const admin = await call('POST', '/api/login', { email: 'admin1@pwani.co.ke', password: 'password123' });
  console.log('3. Admin:', await call('POST', '/api/announcements', post, admin.token));

  console.log('4. List:', await call('GET', '/api/announcements'));
}
run();