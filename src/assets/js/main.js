// Set --nav-h from actual nav height
(function() {
  var nav = document.querySelector('nav');
  function setNavH() {
    document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  }
  setNavH();
  window.addEventListener('resize', setNavH);
})();

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -10px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Mobile nav toggle
var navToggle = document.querySelector('.nav-toggle');
var navList = document.querySelector('nav ul');
if (navToggle && navList) {
  navToggle.addEventListener('click', function() {
    navList.classList.toggle('active');
  });
  navList.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      navList.classList.remove('active');
    });
  });
}

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
var scrollClickActive = false;
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      scrollClickActive = true;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', href);
      setTimeout(function() { scrollClickActive = false; }, 800);
    }
  });
});

// FHNW slideshow
(function() {
  var slideshow = document.querySelector('.fhnw-slideshow');
  if (!slideshow) return;

  var slides = slideshow.querySelectorAll('.fhnw-slide');
  var dots = slideshow.querySelectorAll('.fhnw-dot');
  var current = 0;
  var timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function startTimer() {
    timer = setInterval(next, 5000);
  }

  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() {
      clearInterval(timer);
      goTo(i);
      startTimer();
    });
  });

  slideshow.addEventListener('mouseenter', function() { clearInterval(timer); });
  slideshow.addEventListener('mouseleave', startTimer);

  startTimer();
})();

// Theme toggle
(function() {
  var toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  function getTheme() {
    var stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    toggle.setAttribute('aria-label',
      theme === 'light' ? toggle.dataset.labelLight : toggle.dataset.labelDark);
  }

  applyTheme(getTheme());

  toggle.addEventListener('click', function() {
    var next = getTheme() === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });
})();

// Keep language toggle href in sync with current section
(function() {
  var langLink = document.querySelector('.nav-actions a[href^="/"]');
  if (!langLink) return;
  var baseHref = langLink.getAttribute('href');
  var sections = document.querySelectorAll('section[id]');
  var ticking = false;
  var hashTimer;

  window.addEventListener('scroll', function() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function() {
      var current = '';
      var offset = window.innerHeight / 3;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= offset) {
          current = sections[i].id;
        }
      }
      langLink.setAttribute('href', current ? baseHref + '#' + current : baseHref);
      if (!scrollClickActive) {
        clearTimeout(hashTimer);
        hashTimer = setTimeout(function() {
          history.replaceState(null, '', current ? '#' + current : location.pathname);
        }, 150);
      }
      ticking = false;
    });
  });
})();
