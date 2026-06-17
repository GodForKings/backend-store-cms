# Backend Store with CMS

Бэкенд-сервис для CMS интернет-магазина, построенный на **NestJS** с использованием **Prisma ORM** и **PostgreSQL**.

## 📋 Содержание

- [Технологии](#технологии)
- [Структура проекта](#структура-проекта)
- [Требования](#требования)
- [Установка](#установка)
- [Конфигурация](#конфигурация)
- [Запуск](#запуск)
- [Миграции базы данных](#миграции-базы-данных)
- [API документация](#api-документация)
- [Модули](#модули)
- [Docker](#docker)
- [Тестирование](#тестирование)
- [Линтинг и форматирование](#линтинг-и-форматирование)

---

## 🛠 Технологии

- **NestJS 11** — фреймворк для серверных приложений
- **Prisma 7** — ORM для работы с базой данных
- **PostgreSQL** — реляционная база данных
- **Passport** — аутентификация (JWT, Google OAuth 2.0, Yandex OAuth)
- **Argon2** — хеширование паролей
- **Swagger** — документация API
- **Class Validator / Class Transformer** — валидация DTO
- **Multer** — загрузка файлов
- **YooCheckout** — интеграция с платёжной системой ЮKassa
- **Docker / Docker Compose** — контейнеризация

---

## ⚙️ Требования

- **Node.js** >= 18
- **PostgreSQL** >= 14
- **npm** или **yarn**
- **Docker** (опционально)

---

## 🚀 Установка

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd backend-store-cms

# Установите зависимости
npm install

# Сгенерируйте Prisma-клиент
npm run generate

🔧 Конфигурация
Создайте файл .env в корне проекта и заполните необходимые переменные:

COOKIE_DOMAIN='cookie'
NODE_ENV='среда'
ALLOWED_ORIGINS='разрешенные url-ы через `,`'
SERVER_URL='http://localhost:5000'
DOMAIN='localhost'
CLIENT_URL='http://localhost:3000'
GOOGLE_CLIENT_ID='UR-ID'
GOOGLE_CLIENT_SECRET='UR-Secret'
YANDEX_CLIENT_ID='UR-ID'
YANDEX_CLIENT_SECRET='UR-Secret'
JWT_SECRET='123456'
JWT_ACCESS_TOKEN_TTL='2h'
JWT_REFRESH_TOKEN_TTL='7d'
POSTGRES_USER='user'
POSTGRES_PASSWORD='password'
POSTGRES_HOST='host'
POSTGRES_PORT='port'
POSTGRES_DATABASE='database-name'
POSTGRES_URI="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}?schema=public"

▶️ Запуск

# Режим разработки (с hot-reload)
npm run dev

# Обычный запуск
npm run start

# Режим отладки
npm run start:debug

# Продакшн-сборка и запуск
npm run build
npm run start:prod

# Создание и применение миграции (development)
npm run migrate

# Только генерация Prisma-клиента (без миграции)
npm run generate

📖 API документация
После запуска приложения Swagger-документация доступна по адресу:

http://localhost:3000/api/docs

```
