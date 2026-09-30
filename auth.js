if (localStorage.getItem('loggedIn') === 'true') {
  document.body.classList.add('logged-in');
}
document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      navMenu.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('open');
      }
    });
  }
  const logoutLink = document.getElementById('logoutLink');

  if (logoutLink) {
    logoutLink.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('loggedIn');
      window.location.href = 'index.html';
    });
  }
});