# SoundGram — Сайт

Полноценный сайт для Telegram-клиента SoundGram.
Адаптирован для компьютера, планшета и телефона. Хостинг на GitHub Pages.

---

## 📁 Структура файлов

```
soundgram/
├── index.html                          ← главная страница
├── assets/
│   ├── css/
│   │   └── style.css                   ← все стили
│   ├── js/
│   │   └── main.js                     ← JavaScript
│   ├── screenshots/
│   │   ├── music/                      ← 10 скринов музыкальных функций
│   │   │   ├── screen-m01.jpg          ← Музыкальная библиотека
│   │   │   ├── screen-m02.jpg          ← Умный поиск
│   │   │   ├── screen-m03.jpg          ← Профили исполнителей
│   │   │   ├── screen-m04.jpg          ← Альбомы
│   │   │   ├── screen-m05.jpg          ← Плейлисты
│   │   │   ├── screen-m06.jpg          ← Тексты песен
│   │   │   ├── screen-m07.jpg          ← Эквалайзер
│   │   │   ├── screen-m08.jpg          ← Моя волна
│   │   │   ├── screen-m09.jpg          ← Мини-плеер
│   │   │   └── screen-m10.jpg          ← Настройки музыки
│   │   ├── bypass/                     ← 2 скрина обхода замедлений
│   │   │   ├── screen-b01.jpg          ← Схема / включение обхода
│   │   │   └── screen-b02.jpg          ← Дополнительные настройки туннеля
│   │   ├── custom/                     ← 2 скрина кастомизации
│   │   │   ├── screen-c01.jpg          ← Обои в списке чатов
│   │   │   └── screen-c02.jpg          ← Живые обои в чатах
│   │   └── settings/                   ← 15 скринов настроек
│   │       ├── screen-s01.jpg          ← Основные настройки
│   │       ├── screen-s02.jpg          ← Режим призрака
│   │       ├── screen-s03.jpg          ← Настройки чатов
│   │       ├── screen-s04.jpg          ← Кастомизация UI
│   │       ├── screen-s05.jpg          ← Темы и цвета
│   │       ├── screen-s06.jpg          ← Уведомления
│   │       ├── screen-s07.jpg          ← Конфиденциальность
│   │       ├── screen-s08.jpg          ← Локальный Premium
│   │       ├── screen-s09.jpg          ← Premium-стикеры и реакции
│   │       ├── screen-s10.jpg          ← Скорость загрузки
│   │       ├── screen-s11.jpg          ← Жесты и анимации
│   │       ├── screen-s12.jpg          ← Блокировка приложения
│   │       ├── screen-s13.jpg          ← Встроенный переводчик
│   │       ├── screen-s14.jpg          ← Бета-функции
│   │       └── screen-s15.jpg          ← Для разработчиков
│   └── downloads/
│       ├── soundgram-arm64-v8a.apk     ← APK для ARM64 (большинство телефонов)
│       └── soundgram-armeabi-v7a.apk   ← APK для ARMv7 (старые устройства)
└── README.md
```

---

## 🖼️ Как добавить скриншоты

1. Сделайте скриншоты с телефона (рекомендованный формат: 1080×2340 px, JPEG/WebP)
2. Переименуйте по схеме выше (`screen-m01.jpg`, `screen-b01.jpg` и т.д.)
3. Положите в соответствующие папки в `assets/screenshots/`

> **До добавления скринов:** на сайте будут красивые градиентные заглушки с иконками — сайт выглядит хорошо даже без них.

---

## 📦 Как добавить APK

1. Соберите APK (ARM64-v8a и ARMv7)
2. Положите файлы в `assets/downloads/`:
   - `soundgram-arm64-v8a.apk`
   - `soundgram-armeabi-v7a.apk`

> GitHub имеет ограничение на размер файлов в репозитории: **100 МБ** на файл, **2 ГБ** на репозиторий через Git.
> Если APK больше 100 МБ, используйте **Git LFS** или замените ссылки на загрузку на Telegram-файлы в `index.html`.

---

## 🚀 Публикация на GitHub Pages

### Шаг 1 — Создайте репозиторий

1. Откройте [github.com](https://github.com) → New repository
2. Название: `soundgram` (или любое другое)
3. Тип: **Public**
4. Создайте репозиторий (кнопка «Create repository»)

### Шаг 2 — Загрузите файлы

**Вариант А — через браузер (проще):**
1. Откройте созданный репозиторий
2. Нажмите «Add file» → «Upload files»
3. Перетащите всю папку `soundgram/` с файлами
4. Нажмите «Commit changes»

**Вариант Б — через Git:**
```bash
cd soundgram
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ВАШ_НИК/soundgram.git
git push -u origin main
```

### Шаг 3 — Включите GitHub Pages

1. Откройте репозиторий → **Settings**
2. Слева: **Pages**
3. В разделе «Build and deployment»:
   - Source: **Deploy from a branch**
   - Branch: **main** / **(root)**
4. Нажмите **Save**
5. Через 1-3 минуты сайт будет доступен по адресу:
   `https://ВАШ_НИК.github.io/soundgram/`

---

## 🔗 Замена APK-ссылок на Telegram (если APK > 100 МБ)

Если файлы слишком большие, загрузите APK в Telegram-канал и замените ссылки в `index.html`:

Найдите:
```html
href="assets/downloads/soundgram-arm64-v8a.apk"
href="assets/downloads/soundgram-armeabi-v7a.apk"
```

Замените на ваши ссылки, например:
```html
href="https://t.me/soundgram_project/123"
href="https://t.me/soundgram_project/124"
```

---

## 🎨 Кастомизация названия

Если хотите переименовать клиент — найдите в `index.html` все вхождения `SoundGram` и замените на ваше название.

---

## 💡 Советы по скриншотам

- Делайте скрины на чистом телефоне без лишних уведомлений
- Отключите статус-бар или очистите его перед скрином
- Рекомендуется тёмная тема в приложении — смотрится лучше на сайте
- Форматы: `.jpg` или `.webp` (меньше размер, быстрее загрузка)
- Оптимизируйте изображения через [squoosh.app](https://squoosh.app) перед загрузкой
