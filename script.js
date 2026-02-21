document.addEventListener("DOMContentLoaded", () => {
    // Опции для Intersection Observer
    // threshold 0.1 означает, что анимация начнется, когда 10% элемента появится на экране
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    // Функция обратного вызова при пересечении
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            // Если элемент появился во вьюпорте
            if (entry.isIntersecting) {
                // Добавляем класс .show, который запускает CSS-транзишн
                entry.target.classList.add('show');
                // Прекращаем наблюдение за элементом после его появления (для производительности)
                observer.unobserve(entry.target);
            }
        });
    };

    // Создаем наблюдатель
    const observer = new IntersectionObserver(observerCallback, options);

    // Находим все элементы, которые нужно анимировать (с классом .hidden)
    const hiddenElements = document.querySelectorAll('.hidden');
    
    // Начинаем наблюдение за каждым найденным элементом
    if (hiddenElements.length > 0) {
        hiddenElements.forEach((el) => observer.observe(el));
    }

    // Плавный скролл по якорям в навигации (дополнительная функциональность)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Отступ сверху для учета фиксированной шапки
                    behavior: 'smooth'
                });
            }
        });
    });
});
