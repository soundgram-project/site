/* ═══════════════════════════════════════
   SOUNDGRAM · main.js
═══════════════════════════════════════ */

// ── NAV SCROLL EFFECT ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ── BURGER MENU ──
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-right').forEach(el => {
  observer.observe(el);
});

// Staggered children reveal for grids
const gridObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const children = entry.target.querySelectorAll('.s-card, .custom-card, .bypass-card');
      children.forEach((child, i) => {
        child.style.transitionDelay = `${i * 60}ms`;
        child.style.opacity = '0';
        child.style.transform = 'translateY(24px)';
        child.style.transition = 'opacity .5s ease, transform .5s ease';
        requestAnimationFrame(() => {
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, i * 60);
        });
      });
      gridObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.settings-grid, .custom-grid, .bypass-explain').forEach(el => {
  gridObserver.observe(el);
});

// ── TICKER DUPLICATE (seamless loop) ──
const ticker = document.getElementById('tickerTrack');
if (ticker) {
  ticker.innerHTML += ticker.innerHTML;
}

// ── BROKEN IMAGE HANDLING ──
// When screenshot not yet added, hide <img> and show gradient placeholder
document.querySelectorAll('.pscreen img').forEach(img => {
  img.addEventListener('error', () => {
    img.style.display = 'none';
  });
  // If already broken (cached 404 etc.)
  if (img.complete && img.naturalWidth === 0) {
    img.style.display = 'none';
  }
});


// Video wallpaper fallback

document.querySelectorAll('.pscreen video').forEach(video => {
  video.addEventListener('error', () => {
    video.style.display = 'none';
  });
});

// ── SMOOTH ACTIVE NAV LINK ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? '#fff' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));

// ── PARALLAX BLOBS ──
document.addEventListener('mousemove', (e) => {
  const blobs = document.querySelectorAll('.blob');
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  blobs.forEach((blob, i) => {
    const factor = (i + 1) * 12;
    blob.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
}, { passive: true });

// ── PHONE HOVER TILT ──
document.querySelectorAll('.s-card, .custom-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    card.style.transition = 'transform .1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'border-color .25s, transform .4s, box-shadow .25s';
  });
});

// ── PAGE LOAD ANIMATION ──
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .4s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });

  // Hero text staggers in
  const heroEls = document.querySelectorAll('.hero-text > *');
  heroEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity .6s ease ${i * 0.1 + 0.2}s, transform .6s ease ${i * 0.1 + 0.2}s`;
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });
});
