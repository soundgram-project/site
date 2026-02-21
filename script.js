document.addEventListener("DOMContentLoaded", () => {
    // 1. Анимации появления при скролле (Intersection Observer)
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

    // 3. Динамический 3D-наклон телефонов (Parallax Effect)
    const visuals = document.querySelectorAll('.showcase-visual');

    visuals.forEach(visual => {
        const phone = visual.querySelector('.phone-mockup');
        if (!phone) return;

        // Обработчик движения мыши (считываем с РОДИТЕЛЯ, чтобы не было дёрганий)
        const handleMove = (e) => {
            // Отключаем на мобилках для сохранения плавной прокрутки
            if (window.innerWidth <= 768) return;

            const rect = visual.getBoundingClientRect();
            
            const clientX = e.clientX;
            const clientY = e.clientY;
            
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Снизил угол для плавности
            const rotateY = ((x - centerX) / centerX) * 10;
            
            phone.style.transition = 'transform 0.1s ease-out';
            phone.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        };

        // Возврат в исходное положение
        const resetTilt = () => {
            if (window.innerWidth <= 768) return;
            phone.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            phone.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        };

        // Слушатели только для ПК (мышь)
        visual.addEventListener('mousemove', handleMove);
        visual.addEventListener('mouseleave', resetTilt);
    });
});
