/**
 * SOUNDGRAM INTERACTIVE ENGINE (Vanilla JS)
 * Handles:
 * - Responsive Navbar & Mobile Drawer
 * - Dynamic APK auto-discovery (ARM64, ARMv7)
 * - Interactive Music Carousel (11 screens with synced captions & touch swipe)
 * - High-Res Fullscreen Lightbox with Keyboard & Touch Gestures
 * - 1-Click Card Copy & Toast Notification
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
  // 2. DYNAMIC APK AUTO-DISCOVERY & AUTOMATIC VERSION UPDATE
  // ══════════════════════════════════════════════════════
  let activeApkData = {
    name: 'Soundgra_unibuild_12.10.5.apk',
    url: 'Soundgra_unibuild_12.10.5.apk',
    size: '~93 МБ',
    version: '12.10.5'
  };

  /**
   * Extracts version from filename, e.g.:
   * Soundgra_unibuild_12.10.5.apk -> 12.10.5
   * SoundGram-v12.5.1(1240)-arm64-v8a.apk -> 12.5.1
   * soundgram_12.11.0.apk -> 12.11.0
   * SoundGram_13.0.apk -> 13.0
   */
  const extractVersionFromFilename = (filename) => {
    if (!filename) return null;
    const match = filename.match(/(?:v|version|_|-|\b)(\d+\.\d+(?:\.\d+)?)/i);
    return match ? match[1] : null;
  };

  /**
   * Semantic version comparison helper
   */
  const compareVersions = (v1, v2) => {
    if (!v1 && !v2) return 0;
    if (!v1) return -1;
    if (!v2) return 1;
    const p1 = String(v1).split('.').map(n => parseInt(n, 10) || 0);
    const p2 = String(v2).split('.').map(n => parseInt(n, 10) || 0);
    const len = Math.max(p1.length, p2.length);
    for (let i = 0; i < len; i++) {
      const n1 = p1[i] || 0;
      const n2 = p2[i] || 0;
      if (n1 > n2) return 1;
      if (n1 < n2) return -1;
    }
    return 0;
  };

  const applyApkToUI = (data) => {
    activeApkData = { ...activeApkData, ...data };
    
    // Auto-extract version from filename if not explicitly provided
    if (!activeApkData.version && activeApkData.name) {
      activeApkData.version = extractVersionFromFilename(activeApkData.name) || '12.10.5';
    }

    // 1. Update all download buttons and links
    const apkLinks = document.querySelectorAll('[data-apk-download], a.btn-hero-dl, a.btn-big-dl');
    apkLinks.forEach(link => {
      link.href = activeApkData.url;
      link.setAttribute('download', activeApkData.name);
    });

    // 2. Update Header Brand Badge
    const headerBadge = document.getElementById('headerVersionBadge');
    if (headerBadge) {
      headerBadge.textContent = `v${activeApkData.version}`;
    }

    // 3. Update Drawer Brand Badge
    const drawerBadge = document.getElementById('drawerVersionBadge');
    if (drawerBadge) {
      drawerBadge.textContent = `v${activeApkData.version}`;
    }

    // 4. Update Hero Badge
    const heroBadgeText = document.getElementById('heroBadgeText');
    if (heroBadgeText) {
      heroBadgeText.textContent = `SoundGram v${activeApkData.version} · Релиз`;
    }

    // 5. Update Hero Sub-label
    const heroSubLabel = document.getElementById('heroSubLabel');
    if (heroSubLabel) {
      heroSubLabel.textContent = `${activeApkData.size} · ARM64, ARMv7 · Android 5.0+`;
    }

    // 6. Update Download Card Title
    const dlCardTitle = document.getElementById('dlCardTitle');
    if (dlCardTitle) {
      dlCardTitle.textContent = `SoundGram v${activeApkData.version} (Release)`;
    }

    // 7. Update Download Meta File Name
    const dlFileName = document.getElementById('dlFileName');
    if (dlFileName) dlFileName.textContent = activeApkData.name;

    // 8. Update Download Meta File Size
    const dlFileSize = document.getElementById('dlFileSize');
    if (dlFileSize) dlFileSize.textContent = activeApkData.size;
  };

  const autoDiscoverApk = async () => {
    // 1. Try local latest-apk.json first (fastest, no rate limits)
    try {
      const localRes = await fetch('latest-apk.json?t=' + Date.now());
      if (localRes.ok) {
        const json = await localRes.json();
        if (json && (json.name || json.version)) {
          applyApkToUI(json);
        }
      }
    } catch (e) {}

    // 2. Query GitHub Repo contents & releases to detect ANY new .apk posted in the repo
    try {
      const candidates = [];

      // Check root directory contents
      const rootRes = await fetch('https://api.github.com/repos/soundgram-project/site/contents/?t=' + Date.now());
      if (rootRes.ok) {
        const items = await rootRes.json();
        if (Array.isArray(items)) {
          items.forEach(item => {
            if (item.name && item.name.toLowerCase().endsWith('.apk')) {
              const ver = extractVersionFromFilename(item.name);
              const sizeMb = item.size ? `~${Math.round(item.size / (1024 * 1024))} МБ` : '~93 МБ';
              candidates.push({
                name: item.name,
                url: item.download_url || item.name,
                size: sizeMb,
                version: ver || '0.0.0'
              });
            }
          });
        }
      }

      // Check assets/downloads directory contents
      const dlRes = await fetch('https://api.github.com/repos/soundgram-project/site/contents/assets/downloads/?t=' + Date.now());
      if (dlRes.ok) {
        const items = await dlRes.json();
        if (Array.isArray(items)) {
          items.forEach(item => {
            if (item.name && item.name.toLowerCase().endsWith('.apk')) {
              const ver = extractVersionFromFilename(item.name);
              const sizeMb = item.size ? `~${Math.round(item.size / (1024 * 1024))} МБ` : '~93 МБ';
              candidates.push({
                name: item.name,
                url: item.download_url || `assets/downloads/${item.name}`,
                size: sizeMb,
                version: ver || '0.0.0'
              });
            }
          });
        }
      }

      // Check GitHub Releases
      const relRes = await fetch('https://api.github.com/repos/soundgram-project/site/releases?t=' + Date.now());
      if (relRes.ok) {
        const releases = await relRes.json();
        if (Array.isArray(releases)) {
          releases.forEach(release => {
            const relVer = extractVersionFromFilename(release.tag_name || release.name);
            if (Array.isArray(release.assets)) {
              release.assets.forEach(asset => {
                if (asset.name && asset.name.toLowerCase().endsWith('.apk')) {
                  const ver = extractVersionFromFilename(asset.name) || relVer;
                  const sizeMb = asset.size ? `~${Math.round(asset.size / (1024 * 1024))} МБ` : '~93 МБ';
                  candidates.push({
                    name: asset.name,
                    url: asset.browser_download_url,
                    size: sizeMb,
                    version: ver || '0.0.0'
                  });
                }
              });
            }
          });
        }
      }

      // If candidates found, sort by semver version descending
      if (candidates.length > 0) {
        candidates.sort((a, b) => compareVersions(b.version, a.version));
        const best = candidates[0];

        // Apply if it's greater or equal to current active APK
        if (compareVersions(best.version, activeApkData.version) >= 0) {
          applyApkToUI(best);
        }
      }
    } catch (e) {
      // Graceful fallback to latest-apk.json or static fallback
    }
  };

  autoDiscoverApk();

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-apk-download]');
    if (trigger) {
      trigger.href = activeApkData.url;
      trigger.setAttribute('download', activeApkData.name);
    }
  });

  // ══════════════════════════════════════════════════════
  // 3. MOBILE DRAWER MENU
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
  // 4. COPY TO CLIPBOARD & TOAST NOTIFICATION
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
    }, 3000);
  };

  if (copyCardBtn) {
    copyCardBtn.addEventListener('click', async () => {
      const cardNumberRaw = '2200701999222661';
      const originalHtml = copyCardBtn.innerHTML;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(cardNumberRaw);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = cardNumberRaw;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        copyCardBtn.classList.add('copied');
        copyCardBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="copy-text">Скопировано!</span>
        `;
        showToast('Номер карты 2200 7019 9922 2661 скопирован!');

        setTimeout(() => {
          copyCardBtn.classList.remove('copied');
          copyCardBtn.innerHTML = originalHtml;
        }, 2800);
      } catch (err) {
        showToast('Номер карты: 2200 7019 9922 2661');
      }
    });
  }

  // ══════════════════════════════════════════════════════
  // 5. INTERACTIVE MUSIC CAROUSEL (11 SCREENS)
  // ══════════════════════════════════════════════════════
  const musicViewport = document.getElementById('musicViewport');
  const musicTrack = document.getElementById('musicTrack');
  const musicSlides = document.querySelectorAll('.carousel-slide');
  const musicPrevBtn = document.getElementById('musicPrevBtn');
  const musicNextBtn = document.getElementById('musicNextBtn');
  const musicSlideCounter = document.getElementById('musicSlideCounter');
  const musicTitlePreview = document.getElementById('musicTitlePreview');
  const musicPillDots = document.querySelectorAll('.carousel-pills .pill-dot');

  let currentMusicSlide = 0;
  const totalMusicSlides = musicSlides.length;

  const updateCarouselUI = (index) => {
    currentMusicSlide = Math.max(0, Math.min(index, totalMusicSlides - 1));

    // Update Counter & Title Preview
    if (musicSlideCounter) {
      const formattedNum = (currentMusicSlide + 1 < 10 ? '0' : '') + (currentMusicSlide + 1);
      musicSlideCounter.textContent = `${formattedNum} / ${totalMusicSlides}`;
    }

    const activeSlide = musicSlides[currentMusicSlide];
    if (activeSlide && musicTitlePreview) {
      musicTitlePreview.textContent = activeSlide.getAttribute('data-title') || '';
    }

    // Update Pills
    musicPillDots.forEach((pill, i) => {
      pill.classList.toggle('active', i === currentMusicSlide);
    });

    // Update Slide active class
    musicSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentMusicSlide);
    });
  };

  const scrollToSlide = (index) => {
    if (!musicViewport || !musicSlides[index]) return;
    const targetSlide = musicSlides[index];
    const offset = targetSlide.offsetLeft - (musicViewport.clientWidth - targetSlide.clientWidth) / 2;
    musicViewport.scrollTo({
      left: Math.max(0, offset),
      behavior: 'smooth'
    });
    updateCarouselUI(index);
  };

  if (musicPrevBtn) {
    musicPrevBtn.addEventListener('click', () => {
      const prevIdx = (currentMusicSlide - 1 + totalMusicSlides) % totalMusicSlides;
      scrollToSlide(prevIdx);
    });
  }

  if (musicNextBtn) {
    musicNextBtn.addEventListener('click', () => {
      const nextIdx = (currentMusicSlide + 1) % totalMusicSlides;
      scrollToSlide(nextIdx);
    });
  }

  musicPillDots.forEach((pill, i) => {
    pill.addEventListener('click', () => {
      scrollToSlide(i);
    });
  });

  // Track scroll event to update UI when user scrolls or swipes
  let scrollThrottle;
  if (musicViewport) {
    musicViewport.addEventListener('scroll', () => {
      clearTimeout(scrollThrottle);
      scrollThrottle = setTimeout(() => {
        const scrollCenter = musicViewport.scrollLeft + musicViewport.clientWidth / 2;
        let closestIdx = 0;
        let closestDist = Infinity;

        musicSlides.forEach((slide, i) => {
          const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
          const dist = Math.abs(scrollCenter - slideCenter);
          if (dist < closestDist) {
            closestDist = dist;
            closestIdx = i;
          }
        });

        if (closestIdx !== currentMusicSlide) {
          updateCarouselUI(closestIdx);
        }
      }, 50);
    }, { passive: true });
  }

  // ══════════════════════════════════════════════════════
  // 6. FULLSCREEN LIGHTBOX MODAL
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

  // Collect all lightboxable images
  const allScreens = [
    { src: 'assets/screenshots/music/01-player.jpg', title: 'Полноэкранный плеер', desc: 'Большая обложка, очередь воспроизведения и оффлайн-кэш' },
    { src: 'assets/screenshots/music/02-lyrics.jpg', title: 'Синхронизированные тексты песен', desc: 'Караоке-тексты Synced Lyrics, скроллящиеся в такт' },
    { src: 'assets/screenshots/music/03-equalizer.jpg', title: '10-полосный эквалайзер & BassBoost', desc: 'АЧХ, BassBoost, 3D звук, скорость и тональность' },
    { src: 'assets/screenshots/music/04-library.jpg', title: 'Музыкальная библиотека', desc: 'Плейлисты, треки и альбомы из облачного канала' },
    { src: 'assets/screenshots/music/05-my-wave.jpg', title: 'Интерактивная «Моя волна»', desc: 'Умный поток музыки с фильтром настроения и жанров' },
    { src: 'assets/screenshots/music/06-playlist-view.jpg', title: 'Просмотр и запуск плейлиста', desc: 'Хронометраж, треки и запуск волны по плейлисту' },
    { src: 'assets/screenshots/music/07-albums.jpg', title: 'Каталог студийных релизов', desc: 'Сетка альбомов в высоком разрешении' },
    { src: 'assets/screenshots/music/08-search.jpg', title: 'Глобальный поиск музыки', desc: 'Поиск по трекам, альбомам и артистам по всей базе' },
    { src: 'assets/screenshots/music/09-artist-profile.jpg', title: 'Профиль исполнителя', desc: 'Дискография, популярные треки и профиль музыканта' },
    { src: 'assets/screenshots/music/10-album-tracks.jpg', title: 'Треклист альбома', desc: 'Оригинальный порядок треков и хронометраж' },
    { src: 'assets/screenshots/music/11-visual-tuning.jpg', title: 'Статистика и визуальная настройка', desc: 'Счетчик часов прослушивания, лучи сферы и блюр' },
    { src: 'assets/screenshots/features/01-bypass-proxy.jpg', title: 'SoundGram Bypass', desc: 'Встроенный модифицированный tgws-proxy на порту 1443 без сторонних VPN' },
    { src: 'assets/screenshots/custom/03-iconpack-engine.jpg', title: 'Движок наборов иконок (Iconpack Engine)', desc: 'Поддержка кастомных наборов: exteragram, Nothing, Liquid Glass, Solar, Plumpy' },
    { src: 'assets/screenshots/custom/01-chat-bg.jpg', title: 'Обои в главном списке диалогов', desc: 'Кастомные изображения фоном списка диалогов' },
    { src: 'assets/screenshots/custom/04-typing-anim.jpg', title: 'Анимация набора и жидкий курсор', desc: 'Размытие, вращение букв и плавный курсор' },
    { src: 'assets/screenshots/custom/05-bottom-tabs.jpg', title: 'Органайзер нижних вкладок и папок', desc: 'Свободный порядок вкладок и перенос папок вниз' },
    { src: 'assets/screenshots/custom/07-messages-style.jpg', title: 'Стиль сообщений и секунды во времени', desc: 'Секунды во времени, цвета ответов и стиль цитирования' },
    { src: 'assets/screenshots/features/05-settings-hub.jpg', title: 'Центр настроек SoundGram', desc: 'Единый хаб всех кастомных функций и переключателей' },
    { src: 'assets/screenshots/privacy/01-ghost-mode.jpg', title: 'Режим призрака', desc: 'Скрытие онлайна, историй, тайпинга и нечиталки сообщений' },
    { src: 'assets/screenshots/privacy/02-anti-delete.jpg', title: 'Анти-удаление сообщений', desc: 'Сохранение удаленных текстов, медиа и истории правок' },
    { src: 'assets/screenshots/privacy/03-security-pin.jpg', title: 'Биометрия и экстренный PIN', desc: 'Защита избранного, скрытых чатов и архива паролем' },
    { src: 'assets/screenshots/features/04-video-notes-quality.jpg', title: 'Качество видеокружков', desc: 'Запись кружков в 1080p 60 FPS с битрейтом до 2200 kbps и OIS' },
    { src: 'assets/screenshots/features/03-camerax.jpg', title: 'Настройки камеры', desc: 'Двойная камера, старт со сверхширокоугольного модуля и зум' }
  ];

  let currentLightboxIdx = 0;

  window.openLightbox = (src, title = '', desc = '') => {
    const foundIdx = allScreens.findIndex(s => s.src === src);
    if (foundIdx !== -1) {
      currentLightboxIdx = foundIdx;
      updateLightboxDisplay();
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

  const updateLightboxDisplay = () => {
    const item = allScreens[currentLightboxIdx];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxTitle.textContent = item.title;
    lightboxDesc.textContent = item.desc;
    lightboxCounter.textContent = `${currentLightboxIdx + 1} / ${allScreens.length}`;
  };

  const showPrevLightbox = () => {
    currentLightboxIdx = (currentLightboxIdx - 1 + allScreens.length) % allScreens.length;
    updateLightboxDisplay();
  };

  const showNextLightbox = () => {
    currentLightboxIdx = (currentLightboxIdx + 1) % allScreens.length;
    updateLightboxDisplay();
  };

  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrevLightbox(); });
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNextLightbox(); });

  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevLightbox();
    if (e.key === 'ArrowRight') showNextLightbox();
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
      if (touchEndX < touchStartX - 50) showNextLightbox();
      if (touchEndX > touchStartX + 50) showPrevLightbox();
    }, { passive: true });
  }

  // ══════════════════════════════════════════════════════
  // 7. BACK TO TOP
  // ══════════════════════════════════════════════════════
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
