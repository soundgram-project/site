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
    const phones = document.querySelectorAll('.phone-mockup');

    phones.forEach(phone => {
        // Функция для обработки наклона
        const handleMove = (e) => {
            const rect = phone.getBoundingClientRect();
            
            // Определяем координаты мыши/касания относительно самого элемента
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            
            // Центр элемента
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Вычисляем угол наклона (максимум 15 градусов)
            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;
            
            // Применяем стили без задержки (чтобы телефон "прилипал" к курсору)
            phone.style.transition = 'none';
            phone.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            phone.style.zIndex = '10';
        };

        // Возврат в исходное положение
        const resetTilt = () => {
            phone.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            phone.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            phone.style.zIndex = '1';
        };

        // Слушатели для ПК (мышь)
        phone.addEventListener('mousemove', handleMove);
        phone.addEventListener('mouseleave', resetTilt);

        // Слушатели для телефонов (касания)
        phone.addEventListener('touchmove', handleMove);
        phone.addEventListener('touchend', resetTilt);
    });
});
