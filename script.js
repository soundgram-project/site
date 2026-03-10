document.addEventListener("DOMContentLoaded", () => {
    // 1. Анимации появления при скролле
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, options);
    const hiddenElements = document.querySelectorAll('.hidden');
    
    if (hiddenElements.length > 0) {
        hiddenElements.forEach((el) => observer.observe(el));
    }

    // 2. Плавный скролл по якорям в навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Динамический 3D-наклон телефонов
    const visuals = document.querySelectorAll('.showcase-visual');

    visuals.forEach(visual => {
        const phone = visual.querySelector('.phone-mockup');
        if (!phone) return;

        const handleMove = (e) => {
            if (window.innerWidth <= 1024) return;

            const rect = visual.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;
            
            phone.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out';
            phone.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        };

        const resetTilt = () => {
            if (window.innerWidth <= 1024) return;
            phone.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.6s ease';
            phone.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        };

        visual.addEventListener('mousemove', handleMove);
        visual.addEventListener('mouseleave', resetTilt);
    });

    // 4. Логика переключения изображений в Музыкальном Хабе
    const musicTabs = document.querySelectorAll('.music-tab');
    const dynamicPhoneImg = document.getElementById('dynamic-phone-img');

    if (musicTabs.length > 0 && dynamicPhoneImg) {
        musicTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Убираем класс active у всех
                musicTabs.forEach(t => t.classList.remove('active'));
                // Добавляем нажатому
                tab.classList.add('active');
                
                // Плавное затухание картинки
                dynamicPhoneImg.style.opacity = '0';
                
                // Смена источника и плавное появление
                setTimeout(() => {
                    dynamicPhoneImg.src = tab.getAttribute('data-img');
                    dynamicPhoneImg.style.opacity = '1';
                }, 300); // время должно совпадать с transition в CSS
            });
        });
    }

    // 5. Локальная имитация счетчика скачиваний
    const BASE_DOWNLOADS = 1204;
    const LOCAL_STORAGE_KEY = 'soundgram_downloads';
    const downloadDisplays = document.querySelectorAll('.dl-count-display');
    const downloadTriggers = document.querySelectorAll('.download-trigger');

    let currentDownloads = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (!currentDownloads) {
        currentDownloads = BASE_DOWNLOADS;
        localStorage.setItem(LOCAL_STORAGE_KEY, currentDownloads);
    } else {
        currentDownloads = parseInt(currentDownloads, 10);
    }

    const updateDisplays = (num) => {
        if(downloadDisplays.length === 0) return;
        downloadDisplays.forEach(display => {
            display.textContent = num.toLocaleString('ru-RU');
        });
    };

    updateDisplays(currentDownloads);

    downloadTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            currentDownloads++;
            localStorage.setItem(LOCAL_STORAGE_KEY, currentDownloads);
            updateDisplays(currentDownloads);
        });
    });
});
                    
