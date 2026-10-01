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