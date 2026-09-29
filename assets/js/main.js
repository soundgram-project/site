/**
 * SOUNDGRAM INTERACTIVE ENGINE (Vanilla JS)
 * Handles:
 * - Responsive Navbar & Mobile Drawer
 * - Gallery Filtering & Count
 * - High-Res Fullscreen Lightbox with Keyboard & Touch Gestures
 * - 1-Click Card Copy & Toast Notification
 * - Video Viewport Autoplay/Pause
 */

document.addEventListener('DOMContentLoaded', () => {
  // ══════════════════════════════════════════════════════
  // 1. STICKY NAVBAR SCROLL STATE
  // ══════════════════════════════════════════════════════
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ══════════════════════════════════════════════════════
  // DYNAMIC APK AUTO-DISCOVERY (ANY APK FILENAME)
  // ══════════════════════════════════════════════════════
  let activeApkData = {
    name: 'Soundgra_unibuild_12.10.5.apk',
    url: 'Soundgra_unibuild_12.10.5.apk',
    size: '~93 МБ',
    version: '12.10.5'
  };

  const applyApkToUI = (data) => {
    activeApkData = { ...activeApkData, ...data };
    
    // Update all download elements
    const apkLinks = document.querySelectorAll('[data-apk-download], a.btn-hero-dl, a.btn-big-dl');
    apkLinks.forEach(link => {
      link.href = activeApkData.url;
      link.setAttribute('download', activeApkData.name);
    });

    const dlFileName = document.getElementById('dlFileName');
    if (dlFileName) dlFileName.textContent = activeApkData.name;

    const dlFileSize = document.getElementById('dlFileSize');
    if (dlFileSize) dlFileSize.textContent = activeApkData.size;

    const heroSubLabel = document.getElementById('heroSubLabel');
    if (heroSubLabel) {
      heroSubLabel.textContent = `${activeApkData.size} · ARM64, ARMv7, x86_64 · Android 5.0+`;
    }

    const dlFamMeta = document.getElementById('dlFamMeta');
    if (dlFamMeta) {
      dlFamMeta.textContent = `Универсальный · ${activeApkData.size}`;
    }

    if (activeApkData.version) {
      const heroBadgeText = document.getElementById('heroBadgeText');
      if (heroBadgeText) {
        heroBadgeText.textContent = `SoundGram v${activeApkData.version} · 1 универсальный APK`;
      }
      const dlCardTitle = document.getElementById('dlCardTitle');
      if (dlCardTitle) {
        dlCardTitle.textContent = `SoundGram v${activeApkData.version} (Release)`;
      }
    }
  };

  const autoDiscoverApk = async () => {
    // 1. Try local latest-apk.json first (fastest, no rate limits)
    try {
      const localRes = await fetch('latest-apk.json?t=' + Date.now());
      if (localRes.ok) {
        const json = await localRes.json();
        if (json && json.name) {
          applyApkToUI(json);
        }
      }
    } catch (e) {}

    // 2. Query GitHub Repo contents to detect ANY .apk uploaded in the root or assets/downloads
    try {
      const ghRes = await fetch('https://api.github.com/repos/soundgram-project/site/contents/?t=' + Date.now());
      if (ghRes.ok) {
        const items = await ghRes.json();
        if (Array.isArray(items)) {
          // Find any file ending with .apk (ignoring case)
          const apkFiles = items.filter(f => f.name && f.name.toLowerCase().endsWith('.apk'));
          if (apkFiles.length > 0) {
            // Sort to get newest or largest
            apkFiles.sort((a, b) => b.name.localeCompare(a.name));
            const latest = apkFiles[0];
            const sizeMb = latest.size ? `~${Math.round(latest.size / (1024 * 1024))} МБ` : '~93 МБ';
            const verMatch = latest.name.match(/\d+\.\d+(\.\d+)?/);
            const ver = verMatch ? verMatch[0] : '';
            applyApkToUI({
              name: latest.name,
              url: latest.name,
              size: sizeMb,
              version: ver || activeApkData.version
            });
            return;
          }
        }
      }
    } catch (e) {}
  };

  autoDiscoverApk();

  // On click guarantee: download whatever active APK is resolved
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-apk-download]');
    if (trigger) {
      trigger.href = activeApkData.url;
      trigger.setAttribute('download', activeApkData.name);
    }
  });

  // ══════════════════════════════════════════════════════
  // 2. MOBILE DRAWER MENU
  // ══════════════════════════════════════════════════════
  const burgerToggle = document.getElementById('burgerToggle');
  const drawerClose = document.getElementById('drawerClose');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-footer a');

  const openDrawer = () => {
    mobileDrawer.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    burgerToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    burgerToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (burgerToggle) burgerToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // ══════════════════════════════════════════════════════
  // 3. COPY TO CLIPBOARD & TOAST NOTIFICATION
  // ══════════════════════════════════════════════════════
  const copyCardBtn = document.getElementById('copyCardBtn');
  const toast = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastText');
  let toastTimeout;

  const showToast = (message) => {
    if (!toast) return;
    toastText.textContent = message;
    toast.classList.add('active');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 3200);
  };

  if (copyCardBtn) {
    copyCardBtn.addEventListener('click', async () => {
      const cardNumberRaw = '2200701999222661';
      const originalHtml = copyCardBtn.innerHTML;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(cardNumberRaw);
        } else {
          // Fallback
          const textarea = document.createElement('textarea');
          textarea.value = cardNumberRaw;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        // Visual feedback on button
        copyCardBtn.classList.add('copied');
        copyCardBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Скопировано!</span>
        `;
        showToast('Номер карты 2200 7019 9922 2661 скопирован!');

        setTimeout(() => {
          copyCardBtn.classList.remove('copied');
          copyCardBtn.innerHTML = originalHtml;
        }, 3000);
      } catch (err) {
        showToast('Номер: 2200701999222661');
      }
    });
  }

  // ══════════════════════════════════════════════════════
  // 4. GALLERY FILTERING
  // ══════════════════════════════════════════════════════
  const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-cat');
        if (filter === 'all' || itemCat === filter) {
          item.style.display = 'flex';
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ══════════════════════════════════════════════════════
  // 5. FULLSCREEN LIGHTBOX MODAL
  // ══════════════════════════════════════════════════════
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCounter = document.getElementById('lightboxCounter');

  // Build current image array from gallery items
  const galleryData = Array.from(galleryItems).map(item => ({
    src: item.getAttribute('data-src'),
    title: item.getAttribute('data-title'),
    desc: item.getAttribute('data-desc')
  }));

  let currentIndex = 0;

  window.openLightbox = (src, title = '', desc = '') => {
    // Find index if in gallery
    const foundIdx = galleryData.findIndex(item => item.src === src);
    if (foundIdx !== -1) {
      currentIndex = foundIdx;
      updateLightboxContent();
    } else {
      lightboxImg.src = src;
      lightboxTitle.textContent = title || 'SoundGram';
      lightboxDesc.textContent = desc || '';
      lightboxCounter.textContent = '';
    }

    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const updateLightboxContent = () => {
    const item = galleryData[currentIndex];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxTitle.textContent = item.title;
    lightboxDesc.textContent = item.desc;
    lightboxCounter.textContent = `${currentIndex + 1} / ${galleryData.length}`;
  };

  const showPrevImage = () => {
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  };

  const showNextImage = () => {
    currentIndex = (currentIndex + 1) % galleryData.length;
    updateLightboxContent();
  };

  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Attach click listener to gallery cards
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src');
      const title = item.getAttribute('data-title');
      const desc = item.getAttribute('data-desc');
      window.openLightbox(src, title, desc);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrevImage(); });
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNextImage(); });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
  });

  // Touch Swipe for Lightbox
  let touchStartX = 0;
  let touchEndX = 0;
  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  const handleSwipe = () => {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      showNextImage(); // Swiped left
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      showPrevImage(); // Swiped right
    }
  };

  // ══════════════════════════════════════════════════════
  // 6. VIDEO AUTOPLAY / OBSERVER
  // ══════════════════════════════════════════════════════
  const autoVideos = document.querySelectorAll('.chat-bg-video, .figure-video');
  if (autoVideos.length > 0 && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const vid = entry.target;
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      });
    }, { threshold: 0.2 });
    autoVideos.forEach(v => videoObserver.observe(v));
  }

  // ══════════════════════════════════════════════════════
  // 7. FEATURES STAGE INTERACTIVE TABBED SLIDER
  // ══════════════════════════════════════════════════════
  const stageTabs = document.querySelectorAll('#featureTabs .feat-tab-btn');
  const stagePanels = document.querySelectorAll('#stageContentPanels .stage-panel');
  const stageDots = document.querySelectorAll('#stageDots .s-dot');
  const stageImg = document.getElementById('stageImg');
  const stageWrapper = document.querySelector('.features-stage-wrapper');

  const stageScreenshots = [
    'assets/screenshots/music/01-player.jpg',
    'assets/screenshots/custom/01-chat-bg.jpg',
    'assets/screenshots/privacy/01-ghost-mode.jpg',
    'assets/screenshots/features/04-video-notes-quality.jpg'
  ];

  let currentStageSlide = 0;

  const setStageSlide = (index) => {
    currentStageSlide = (index + stageScreenshots.length) % stageScreenshots.length;

    // Tabs
    stageTabs.forEach((tab, i) => {
      const isActive = i === currentStageSlide;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Panels
    stagePanels.forEach((panel, i) => {
      panel.classList.toggle('active', i === currentStageSlide);
    });

    // Dots
    stageDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentStageSlide);
    });

    // Image crossfade
    if (stageImg) {
      stageImg.style.opacity = '0';
      stageImg.style.transform = 'scale(0.97)';
      setTimeout(() => {
        stageImg.src = stageScreenshots[currentStageSlide];
        stageImg.style.opacity = '1';
        stageImg.style.transform = 'scale(1)';
      }, 160);
    }
  };

  stageTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-slide'), 10);
      setStageSlide(idx);
    });
  });

  stageDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-slide'), 10);
      setStageSlide(idx);
    });
  });

  // Touch Swipe on Stage Screen
  let stageTouchStartX = 0;
  let stageTouchEndX = 0;
  if (stageWrapper) {
    stageWrapper.addEventListener('touchstart', (e) => {
      stageTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    stageWrapper.addEventListener('touchend', (e) => {
      stageTouchEndX = e.changedTouches[0].screenX;
      const swipeDist = 50;
      if (stageTouchEndX < stageTouchStartX - swipeDist) {
        setStageSlide(currentStageSlide + 1);
      } else if (stageTouchEndX > stageTouchStartX + swipeDist) {
        setStageSlide(currentStageSlide - 1);
      }
    }, { passive: true });
  }

  // ══════════════════════════════════════════════════════
  // 8. BACK TO TOP
  // ══════════════════════════════════════════════════════
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
