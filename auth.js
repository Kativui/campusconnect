if (localStorage.getItem('loggedIn') === 'true') {
  document.body.classList.add('logged-in');
}
document.addEventListener('DOMContentLoaded', function () {
  const logoutLink = document.getElementById('logoutLink');

  if (logoutLink) {
    logoutLink.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('loggedIn');
      window.location.href = 'index.html';
    });
  }
});