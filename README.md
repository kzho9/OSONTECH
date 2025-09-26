# OSON VPN - Система продажи VPN-ключей

> Безопасная и современная система продажи VPN-доступа с интеграцией MarzBan, поддержкой мультиязычности и автоматизированным биллингом.

[![CI Pipeline](https://github.com/LeGenda/OSONTECH/workflows/CI%20Pipeline/badge.svg)](https://github.com/LeGenda/OSONTECH/actions)
[![CD Pipeline](https://github.com/LeGenda/OSONTECH/workflows/CD%20Pipeline/badge.svg)](https://github.com/LeGenda/OSONTECH/actions)

## 🚀 Особенности

- **🔐 Безопасность**: JWT аутентификация, защита от атак, шифрование данных
- **🌍 Мультиязычность**: Поддержка русского, узбекского и английского языков
- **💳 Платежи**: Интеграция с Click.uz и Payme.uz
- **🔧 VPN интеграция**: Автоматическое управление через MarzBan API
- **📊 Мониторинг**: Sentry для отслеживания ошибок, Redis для кэширования
- **🐳 Docker**: Готовая контейнеризация для развертывания
- **⚡ CI/CD**: Автоматизированная проверка и развертывание

## 📋 Технологический стек

### Backend
- **Framework**: Node.js 20 + Express.js + TypeScript
- **Database**: PostgreSQL 14 + Prisma ORM
- **Cache**: Redis 7
- **Validation**: Zod
- **Security**: Helmet.js + express-rate-limit
- **Monitoring**: Sentry

### Frontend
- **Framework**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **API Client**: TanStack Query + Axios
- **Forms**: React Hook Form
- **i18n**: next-i18next

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Reverse Proxy**: Nginx
- **Process Manager**: PM2

## 🛠 Быстрый запуск

### Предварительные требования

- Node.js 20+
- Docker и Docker Compose
- PostgreSQL 14 (или через Docker)
- Redis 7 (или через Docker)

### 1. Клонирование репозитория

```bash
git clone https://github.com/LeGenda/OSONTECH.git
cd OSONTECH
```

### 2. Настройка переменных окружения

```bash
# Скопируйте примеры конфигураций
cp .env.example .env
cp backend/.env.example backend/.env

# Отредактируйте .env файлы с вашими настройками
```

### 3. Запуск для разработки

```bash
# Запуск только баз данных для разработки
docker-compose -f docker-compose.dev.yml up -d

# Установка зависимостей
cd backend && npm install
cd ../frontend && npm install

# Запуск backend
cd backend
npm run dev

# В другом терминале - запуск frontend
cd frontend
npm run dev
```

### 4. Запуск в production

```bash
# Настройте переменные окружения в .env
cp .env.example .env

# Запустите все сервисы
docker-compose up -d

# Проверьте состояние
docker-compose ps
```

## 🗄 База данных

### Инициализация

```bash
# Генерация Prisma клиента
cd backend
npm run prisma:generate

# Запуск миграций
npm run prisma:migrate

# Заполнение тестовыми данными (опционально)
npm run prisma:seed
```

### Управление

```bash
# Prisma Studio (GUI для БД)
npm run prisma:studio

# Создание новой миграции
npm run prisma:migrate -- --name migration_name

# Деплой миграций в production
npm run prisma:migrate deploy
```

## 🔧 Конфигурация

### Основные переменные окружения

| Переменная | Описание | Обязательная |
|------------|----------|--------------|
| `DATABASE_URL` | URL подключения к PostgreSQL | ✅ |
| `REDIS_URL` | URL подключения к Redis | ✅ |
| `JWT_SECRET` | Секретный ключ для JWT | ✅ |
| `MARZBAN_BASE_URL` | URL сервера MarzBan | ✅ |
| `CLICK_MERCHANT_ID` | ID мерчанта Click.uz | ❌ |
| `PAYME_MERCHANT_ID` | ID мерчанта Payme.uz | ❌ |
| `SENTRY_DSN` | DSN для мониторинга Sentry | ❌ |

### MarzBan интеграция

```bash
# Настройка подключения к MarzBan
MARZBAN_BASE_URL=https://your-marzban-server.com
MARZBAN_USERNAME=admin
MARZBAN_PASSWORD=your-password
```

### Платежные системы

```bash
# Click.uz
CLICK_MERCHANT_ID=your_merchant_id
CLICK_SECRET_KEY=your_secret_key

# Payme.uz
PAYME_MERCHANT_ID=your_merchant_id
PAYME_SECRET_KEY=your_secret_key
```

## 🔐 API Документация

### Аутентификация

```bash
# Регистрация
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "language": "ru"
}

# Вход
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Пользователь

```bash
# Получение профиля
GET /api/user/profile
Authorization: Bearer <access_token>

# Получение подписок
GET /api/user/subscriptions?page=1&limit=10
Authorization: Bearer <access_token>

# Получение VPN конфигураций
GET /api/user/vpn-configs
Authorization: Bearer <access_token>
```

### Публичные эндпоинты

```bash
# Получение тарифов
GET /api/pricing-plans

# Health check
GET /health
```

## 🧪 Тестирование

```bash
# Backend тесты
cd backend
npm run test                # Запуск тестов
npm run test:watch         # Тесты в watch режиме
npm run test:coverage      # Тесты с покрытием

# Frontend тесты
cd frontend
npm run test
```

## 🚀 Развертывание

### Локальное развертывание с Docker

```bash
# Сборка и запуск
docker-compose up --build -d

# Проверка логов
docker-compose logs -f

# Остановка
docker-compose down
```

### Развертывание на VPS

1. **Подготовка сервера**:
   ```bash
   # Обновление системы
   sudo apt update && sudo apt upgrade -y
   
   # Установка Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Установка Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Настройка проекта**:
   ```bash
   # Клонирование
   git clone https://github.com/LeGenda/OSONTECH.git
   cd OSONTECH
   
   # Настройка переменных
   cp .env.example .env
   # Отредактируйте .env файл
   
   # Запуск
   docker-compose up -d
   ```

3. **Настройка SSL** (опционально):
   ```bash
   # Установка Certbot
   sudo apt install certbot
   
   # Получение сертификата
   sudo certbot certonly --standalone -d yourdomain.com
   
   # Обновите nginx.conf с SSL настройками
   ```

### CI/CD с GitHub Actions

1. **Настройка secrets в GitHub**:
   - `SERVER_HOST` - IP адрес сервера
   - `SERVER_USER` - пользователь для SSH
   - `SERVER_SSH_KEY` - приватный SSH ключ
   - `TELEGRAM_BOT_TOKEN` - токен Telegram бота
   - `TELEGRAM_CHAT_ID` - ID чата для уведомлений

2. **Автоматический деплой**:
   - Push в ветку `main` запускает CD pipeline
   - Сборка Docker образов и деплой на сервер
   - Уведомления в Telegram о статусе

## 🔧 Администрирование

### Управление пользователями

```bash
# Создание админа через API
POST /api/admin/users
Authorization: Bearer <admin_token>

{
  "email": "admin@example.com",
  "password": "admin123",
  "first_name": "Admin",
  "role": "admin"
}
```

### Мониторинг

- **Logs**: `docker-compose logs -f service_name`
- **Metrics**: Доступны через health endpoints
- **Database**: PgAdmin на http://localhost:8080
- **Redis**: Redis Commander на http://localhost:8081

### Резервное копирование

```bash
# Backup базы данных
docker-compose exec postgres pg_dump -U postgres oson_vpn > backup.sql

# Backup Redis
docker-compose exec redis redis-cli --rdb /data/dump.rdb
```

## 🤝 Разработка

### Структура проекта

```
OSONTECH/
├── backend/                 # Node.js API
│   ├── src/
│   │   ├── config/         # Конфигурации
│   │   ├── controllers/    # Контроллеры
│   │   ├── routes/        # Маршруты
│   │   ├── services/      # Бизнес логика
│   │   ├── middleware/    # Middleware
│   │   ├── utils/         # Утилиты
│   │   ├── types/         # TypeScript типы
│   │   └── validations/   # Zod схемы
│   ├── prisma/           # База данных
│   └── Dockerfile
├── frontend/             # Next.js приложение
│   ├── src/
│   │   ├── components/   # React компоненты
│   │   ├── pages/       # Страницы
│   │   ├── hooks/       # Custom hooks
│   │   ├── utils/       # Утилиты
│   │   └── api/         # API клиенты
│   └── Dockerfile
├── .github/workflows/    # CI/CD
├── docker-compose.yml    # Production
└── docker-compose.dev.yml # Development
```

### Добавление новых функций

1. **Backend API**:
   ```bash
   # Добавление новой валидации
   # backend/src/validations/newFeature.ts
   
   # Добавление сервиса
   # backend/src/services/newFeatureService.ts
   
   # Добавление контроллера
   # backend/src/controllers/newFeatureController.ts
   
   # Добавление маршрутов
   # backend/src/routes/newFeature.ts
   ```

2. **Frontend компонент**:
   ```bash
   # Создание компонента
   # frontend/src/components/NewFeature/
   
   # Добавление API хука
   # frontend/src/hooks/useNewFeature.ts
   
   # Добавление страницы
   # frontend/src/pages/new-feature.tsx
   ```

### Стайл-гайд

- **TypeScript**: Строгая типизация обязательна
- **ESLint + Prettier**: Автоматическое форматирование
- **Commit messages**: Conventional Commits
- **Тестирование**: Покрытие критичных функций

## 📝 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 📞 Поддержка

- **Email**: support@osonvpn.com
- **Telegram**: [@osonvpn_support](https://t.me/osonvpn_support)
- **Issues**: [GitHub Issues](https://github.com/LeGenda/OSONTECH/issues)

## 🔄 Changelog

### v1.0.0 (2025-01-XX)
- ✨ Первоначальный релиз
- 🔐 JWT аутентификация
- 💳 Интеграция с Click.uz и Payme.uz
- 🌍 Мультиязычность (ru/uz/en)
- 🔧 MarzBan интеграция
- 🐳 Docker контейнеризация
- 🚀 CI/CD pipeline

---

**Сделано с ❤️ для безопасного интернета**