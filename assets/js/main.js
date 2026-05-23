/* SOUNDGRAM · main.js v3 */

// ── NAV ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20), {passive:true});

// ── BURGER ──
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

// ── TICKER ──
const ticker = document.getElementById('ticker');
if (ticker) ticker.innerHTML += ticker.innerHTML;

// ── BROKEN IMG → hide, show placeholder ──
document.querySelectorAll('.mscreen img').forEach(img => {
  const hide = () => (img.style.display = 'none');
  img.addEventListener('error', hide);
  if (img.complete && img.naturalWidth === 0) hide();
});

// ════════════════════════
// MUSIC CAROUSEL
// ════════════════════════
(function() {
  const track    = document.getElementById('mcarTrack');
  const descTrack = document.getElementById('mcarDescTrack');
  const dotsWrap = document.getElementById('mcarDots');
  const prevBtn  = document.getElementById('mcarPrev');
  const nextBtn  = document.getElementById('mcarNext');
  if (!track) return;

  const slides = track.querySelectorAll('.mcar-slide');
  const total  = slides.length;
  let cur = 0;

  // Build dots
  for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'mcar-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  }

  function goTo(n) {
    cur = (n + total) % total;
    track.style.transition = 'transform .35s cubic-bezier(.4,0,.2,1)';
    track.style.transform = `translateX(-${cur * 100}%)`;
    descTrack.style.transform = `translateX(-${cur * 100}%)`;
    dotsWrap.querySelectorAll('.mcar-dot').forEach((d, i) => d.classList.toggle('active', i === cur));
  }

  prevBtn.addEventListener('click', () => goTo(cur - 1));
  nextBtn.addEventListener('click', () => goTo(cur + 1));

  // Swipe
  let sx = 0;
  track.parentElement.parentElement.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, {passive:true});
  track.parentElement.parentElement.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) goTo(cur + (dx < 0 ? 1 : -1));
  }, {passive:true});
})();

// ════════════════════════
// SETTINGS CAROUSEL
// ════════════════════════
(function() {
  const track    = document.getElementById('scarTrack');
  const dotsWrap = document.getElementById('scarDots');
  const prevBtn  = document.getElementById('scarPrev');
  const nextBtn  = document.getElementById('scarNext');
  if (!track) return;

  const slides   = track.querySelectorAll('.scar-slide');
  const total    = slides.length;
  let cur = 0;

  // How many visible per page (responsive)
  function perPage() {
    if (window.innerWidth < 500)  return 1;
    if (window.innerWidth < 768)  return 2;
    if (window.innerWidth < 1024) return 3;
    return 4;
  }

  // Slide width = mock-md width (230px) + gap (20px)
  const SLIDE_W = 230 + 20;

  function pages() { return Math.ceil(total / perPage()); }

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pages(); i++) {
      const d = document.createElement('div');
      d.className = 'scar-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goPage(i));
      dotsWrap.appendChild(d);
    }
  }

  function goPage(p) {
    cur = Math.max(0, Math.min(p, pages() - 1));
    const offset = cur * perPage() * SLIDE_W;
    track.style.transform = `translateX(-${offset}px)`;
    dotsWrap.querySelectorAll('.scar-dot').forEach((d, i) => d.classList.toggle('active', i === cur));
    if (prevBtn) prevBtn.disabled = cur === 0;
    if (nextBtn) nextBtn.disabled = cur >= pages() - 1;
  }

  buildDots();
  goPage(0);
  window.addEventListener('resize', () => { buildDots(); goPage(0); });

  if (prevBtn) prevBtn.addEventListener('click', () => goPage(cur - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goPage(cur + 1));

  // Swipe
  let sx = 0;
  track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) goPage(cur + (dx < 0 ? 1 : -1));
  }, {passive:true});
})();

// ── SCROLL REVEAL ──
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, {threshold: 0.07, rootMargin:'0px 0px -40px 0px'});

document.querySelectorAll('.sh, .byp-card, .cust-card, .dl-card').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity .5s ease ${(i % 5) * 60}ms, transform .5s ease ${(i % 5) * 60}ms`;
  io.observe(el);
});

// ── PARALLAX BLOBS ──
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', e => {
    const cx = innerWidth / 2, cy = innerHeight / 2;
    const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
    document.querySelectorAll('.blob').forEach((b, i) => {
      const f = (i + 1) * 10;
      b.style.transform = `translate(${dx*f}px,${dy*f}px)`;
    });
  }, {passive:true});
}
