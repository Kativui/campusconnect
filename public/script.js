 const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginMessage = document.getElementById('loginMessage');

loginBtn.addEventListener('click', async function () {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (email === '' || password === '') {
  loginMessage.textContent = 'Please fill in both fields.';
  loginMessage.className = 'error';
  return;
    }
    if (!email.endsWith('@pwani.co.ke')) {
  loginMessage.textContent = 'Use your school email (@pwani.co.ke).';
  loginMessage.className = 'error';
  return;
}
    loginMessage.textContent = 'Logging in...';
    loginMessage.className = '';
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) {
            loginMessage.textContent = data.error;
            loginMessage.className = 'error';
            return;
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'home.html';
    } catch (err) {
        loginMessage.textContent = 'Cannot reach the server.';
        loginMessage.className = 'error';
    }
});
const signupBtn = document.getElementById('signupBtn');
const signupMessage = document.getElementById('signupMessage');

signupBtn.addEventListener('click', async function () {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;

    if (name === '' || email === '' || password === '') {
        signupMessage.textContent = 'Please fill in all fields.';
        signupMessage.className = 'error';
        return;
    }

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });
        const data = await response.json();
        if (!response.ok) {
            signupMessage.textContent = data.error;
            signupMessage.className = 'error';
            return;
        }
        signupMessage.textContent = 'Account created. You can now log in above.';
        signupMessage.className = 'success';
    } catch (err) {
        signupMessage.textContent = 'Cannot reach the server.';
        signupMessage.className = 'error';
    }
});