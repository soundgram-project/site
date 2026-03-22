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
        const scrollOptions = {
            root: null,
            rootMargin: '-30% 0px -40% 0px',
            threshold: 0
        };

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    textBlocks.forEach(block => block.classList.remove('active'));
                    entry.target.classList.add('active');

                    const newImgSrc = entry.target.getAttribute('data-img');
                    
                    if (!stickyImg.src.includes(newImgSrc)) {
                        stickyImg.style.opacity = '0';
                        setTimeout(() => {
                            stickyImg.src = newImgSrc;
                            stickyImg.style.opacity = '1';
                        }, 300);
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

    // 4. Логика карусели скриншотов
    const track = document.getElementById('settings-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (track && prevBtn && nextBtn) {
        // Шаг скролла = примерная ширина одного скриншота + отступ
        const scrollAmount = 284; 

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }
});
