 const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginMessage = document.getElementById('loginMessage');

loginBtn.addEventListener('click', function () {
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
loginMessage.textContent = 'Login successful!';
loginMessage.className = 'success';
localStorage.setItem('loggedIn', 'true');
document.body.classList.add('logged-in');
window.location.href = 'home.html';
});