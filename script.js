document.addEventListener("DOMContentLoaded", () => {
    // 1. Анимации появления при скролле
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
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
            if (window.innerWidth <= 768) return;

            const rect = visual.getBoundingClientRect();
            const clientX = e.clientX;
            const clientY = e.clientY;
            
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            phone.style.transition = 'transform 0.1s ease-out';
            phone.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        };

        const resetTilt = () => {
            if (window.innerWidth <= 768) return;
            phone.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            phone.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        };

        visual.addEventListener('mousemove', handleMove);
        visual.addEventListener('mouseleave', resetTilt);
    });

    // 4. Логика счетчика скачиваний (Локальная имитация)
    const BASE_DOWNLOADS = 1204; // Базовое красивое число
    const LOCAL_STORAGE_KEY = 'soundgram_downloads';
    
    const downloadDisplays = document.querySelectorAll('.dl-count-display');
    const downloadTriggers = document.querySelectorAll('.download-trigger');

    // Получаем текущее количество (базовое + то, что накликал пользователь)
    let currentDownloads = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (!currentDownloads) {
        currentDownloads = BASE_DOWNLOADS;
        localStorage.setItem(LOCAL_STORAGE_KEY, currentDownloads);
    } else {
        currentDownloads = parseInt(currentDownloads, 10);
    }

    // Функция обновления цифр на сайте
    const updateDisplays = (num) => {
        downloadDisplays.forEach(display => {
            display.textContent = num.toLocaleString('ru-RU');
        });
    };

    updateDisplays(currentDownloads);

    // Добавляем событие клика на кнопки скачивания
    downloadTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            currentDownloads++;
            localStorage.setItem(LOCAL_STORAGE_KEY, currentDownloads);
            updateDisplays(currentDownloads);
        });
    });
});
