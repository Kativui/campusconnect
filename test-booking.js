async function call(path, body, token) {
  const res = await fetch('http://localhost:3000' + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: 'Bearer ' + token }) },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function run() {
  const booking = { room: 'LTW 1', day: 'Monday', slot: '8-10', week: 1, reason: 'Makeup class' };

  console.log('1. No token:', await call('/api/bookings', booking));

  const student = await call('/api/login', { email: 'test@pwani.co.ke', password: 'password123' });
  console.log('2. Student:', await call('/api/bookings', booking, student.token));

  const lecturer = await call('/api/login', { email: 'lecturer@pwani.co.ke', password: 'password123' });
   console.log('lecturer login:', lecturer);
  console.log('3. Lecturer:', await call('/api/bookings', booking, lecturer.token));
  console.log('4. Same slot again:', await call('/api/bookings', booking, lecturer.token));
}
run();