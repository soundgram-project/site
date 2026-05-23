/* SOUNDGRAM · main.js v2 */

// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20), {passive:true});

// Burger
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  burger.classList.remove('open');
  navLinks.classList.remove('open');
}));

// Ticker duplicate for seamless loop
const ticker = document.getElementById('ticker');
if (ticker) ticker.innerHTML += ticker.innerHTML;

// Broken images → hide, show gradient placeholder
document.querySelectorAll('.mscreen img').forEach(img => {
  const hide = () => (img.style.display = 'none');
  img.addEventListener('error', hide);
  if (img.complete && img.naturalWidth === 0) hide();
});

// ── MUSIC TABS (interactive) ──
const tabs = document.querySelectorAll('.music-tab');
const musicImg = document.getElementById('musicImg');
const musicFb  = document.getElementById('musicFb');
const musicFbIcon = document.getElementById('musicFbIcon');
const musicFbTxt  = document.getElementById('musicFbTxt');

function activateTab(tab) {
  tabs.forEach(t => t.classList.remove('active'));
  tab.classList.add('active');

  const img = tab.dataset.img;
  const ca  = tab.dataset.ca;
  const cb  = tab.dataset.cb;
  const icon = tab.dataset.icon;
  const fn  = tab.dataset.fn;

  // Fade transition
  musicImg.style.opacity = '0';
  setTimeout(() => {
    musicImg.src = img;
    musicImg.onload  = () => musicImg.style.opacity = '1';
    musicImg.onerror = () => (musicImg.style.display = 'none', musicImg.style.opacity = '1');
    musicImg.style.display = '';
  }, 180);

  musicFb.style.setProperty('--ca', ca);
  musicFb.style.setProperty('--cb', cb);
  musicFbIcon.textContent = icon;
  musicFbTxt.textContent  = fn;
}

musicImg.style.transition = 'opacity .18s ease';

tabs.forEach(tab => {
  tab.addEventListener('click', () => activateTab(tab));
});

// ── SETTINGS MODAL ──
const modal     = document.getElementById('modal');
const modalBg   = document.getElementById('modalBg');
const modalClose = document.getElementById('modalClose');
const modalImg  = document.getElementById('modalImg');
const modalName = document.getElementById('modalName');
const modalFb   = document.getElementById('modalFb');

document.querySelectorAll('.set-item').forEach(item => {
  item.addEventListener('click', () => {
    const img  = item.dataset.img;
    const name = item.dataset.name;
    // grab colors from inline phone inside the item
    const inlinePhone = item.querySelector('.mfb');
    const ca = inlinePhone ? inlinePhone.style.getPropertyValue('--ca') : '#9333ea';
    const cb = inlinePhone ? inlinePhone.style.getPropertyValue('--cb') : '#ec4899';

    modalName.textContent = name;
    modalImg.src = img;
    modalImg.style.display = '';
    modalImg.onerror = () => (modalImg.style.display = 'none');
    modalFb.style.setProperty('--ca', ca.trim());
    modalFb.style.setProperty('--cb', cb.trim());

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}
modalBg.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', e => e.key === 'Escape' && closeModal());

// ── REVEAL ON SCROLL ──
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, {threshold: 0.08, rootMargin:'0px 0px -40px 0px'});

document.querySelectorAll('.sh, .byp-card, .cust-card, .dl-card, .set-item').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(22px)';
  el.style.transition = `opacity .55s ease ${(i % 6) * 55}ms, transform .55s ease ${(i % 6) * 55}ms`;
  io.observe(el);
});

// ── PARALLAX BLOBS (desktop only) ──
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', e => {
    const cx = innerWidth / 2, cy = innerHeight / 2;
    const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
    document.querySelectorAll('.blob').forEach((b, i) => {
      const f = (i + 1) * 10;
      b.style.transform = `translate(${dx * f}px,${dy * f}px)`;
    });
  }, {passive: true});
}
