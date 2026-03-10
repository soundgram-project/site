document.addEventListener("DOMContentLoaded", () => {
    // 1. Анимации появления (hidden -> show)
    const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const appearObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    document.querySelectorAll('.hidden').forEach(el => appearObserver.observe(el));

    // 2. Логика Sticky Scroll (Смена картинок в телефоне)
    const textBlocks = document.querySelectorAll('.scroll-text-block');
    const stickyImg = document.getElementById('sticky-phone-img');

    if (textBlocks.length > 0 && stickyImg) {
        // Настройки для определения, какой блок сейчас читает юзер
        const scrollOptions = {
            root: null,
            rootMargin: '-30% 0px -40% 0px', // Блок считается активным, когда он по центру экрана
            threshold: 0
        };

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Убираем подсветку у всех
                    textBlocks.forEach(block => block.classList.remove('active'));
                    // Подсвечиваем текущий текст
                    entry.target.classList.add('active');

                    // Плавно меняем картинку
                    const newImgSrc = entry.target.getAttribute('data-img');
                    
                    // Если картинка другая — делаем красивый fade-эффект
                    if (!stickyImg.src.includes(newImgSrc)) {
                        stickyImg.style.opacity = '0';
                        setTimeout(() => {
                            stickyImg.src = newImgSrc;
                            stickyImg.style.opacity = '1';
                        }, 300); // Время совпадает с transition в CSS
                    }
                }
            });
        }, scrollOptions);

        textBlocks.forEach(block => scrollObserver.observe(block));
    }

    // 3. Плавный скролл для якорей
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Имитация счетчика скачиваний
    const LOCAL_KEY = 'soundgram_dls';
    let currentDls = localStorage.getItem(LOCAL_KEY) ? parseInt(localStorage.getItem(LOCAL_KEY)) : 1204;

    document.querySelectorAll('.download-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            currentDls++;
            localStorage.setItem(LOCAL_KEY, currentDls);
        });
    });
});
