// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -10px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Close mobile nav on link click
document.querySelectorAll('nav ul a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('nav ul').classList.remove('active');
  });
});

// About section expand/collapse
const aboutToggle = document.getElementById('about-toggle');
const aboutFull = document.getElementById('about-full');
if (aboutToggle && aboutFull) {
  aboutToggle.addEventListener('click', () => {
    const expanded = aboutFull.classList.toggle('expanded');
    aboutToggle.classList.toggle('expanded', expanded);
    aboutToggle.querySelector('.about-toggle-text').textContent =
      expanded ? aboutToggle.dataset.less : aboutToggle.dataset.more;
    aboutToggle.setAttribute('aria-expanded', expanded);
  });
}

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
