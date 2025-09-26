# Новое Техническое Задание: OSON VPN - Упрощенная версия (обновленная архитектура с учетом правок)

## 1. Общее описание

Создать систему продажи VPN-ключей с простой биллинговой системой, интеграцией с MarzBan, поддержкой узбекского, русского и английского языков, с возможностью развертывания на VPS, с автоматизированным CI/CD.

## 2. Цель проекта

Создать стабильное решение для продажи VPN-доступа с дружелюбным интерфейсом, минимальными требованиями к постоянному вмешательству, но с потенциалом к дальнейшему развитию.

## 3. Технологический стек

### Frontend:
- React 18
- Next.js 14 (для SEO и SSR)
- TypeScript
- Tailwind CSS
- next-i18next (для мультиязычности)
- react-hook-form (для форм)
- TanStack Query (для API запросов)
- axios (для HTTP запросов)

### Backend:
- Node.js 20 LTS
- Express.js 4.x
- TypeScript
- Prisma ORM (для работы с PostgreSQL)
- PostgreSQL 14
- Redis (для кэширования и сессий)
- bcrypt (для хэширования паролей)
- JWT (для аутентификации)
- Zod (для валидации)
- node-cron (для фоновых задач)
- nodemailer (для email уведомлений)
- axios (для HTTP запросов к сторонним API)
- Sentry (для мониторинга ошибок)
- express-rate-limit (для защиты от брутфорса)
- Helmet.js (для security headers)
- i18next (для мультиязычности на бэкенде)

### Интеграции:
- MarzBan API (для управления VPN-аккаунтами)
- Click.uz SDK
- Payme.uz SDK
- Telegram Bot API для уведомлений

### DevOps:
- Docker
- Docker Compose
- GitHub Actions (CI/CD)
- PM2 (для процесс менеджмента)

## 4. Структура проекта

```
oson-vpn/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── validations/  # Zod схемы
│   │   └── app.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── locales/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── locales/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .github/workflows/
│   ├── ci.yml
│   └── cd.yml
├── nginx.conf
└── README.md
```

## 5. Функциональные требования

### 5.1. Регистрация и аутентификация
- Регистрация по email и паролю (с технической возможностью в будущем изменить тип регистрации и обязательных данных для этого)
- Вход с валидацией
- Восстановление пароля через email
- Защита от брутфорса (rate limiting)
- Сессии пользователей через Redis

### 5.2. Личный кабинет пользователя
- Просмотр активных подписок
- Покупка новых подписок
- Продление подписок
- Получение VPN-конфигурации (QR-код, файл, скопировать ключ)
- История платежей
- Профиль пользователя (редактирование)

### 5.3. Тарифы и биллинг
- Простая система тарифов (месячные, полугодовые, годовые, триальные, возможность создания реферальных)
- Интеграция с Click.uz и Payme.uz
- Автоматическое продление при оплате, приостановка при непоплате, автоматическое переключение с триального недельного тарифа на месячный, upgrade/downgrade тарифов с перерасчетом
- Отображение стоимости в разных валютах

### 5.4. VPN-управление
- Автоматическое создание VPN-аккаунта при оплате
- Автоматическое отключение vpn ключа при окончании подписки, последующее удаление с сервера marzban при не продлении в течение недели
- Возможность ротации ключей/замены ключей пользователями на том или ином сервере с учетом срока действия подписки клиента, при отключении сервера и вывода его из инфраструктуры
- Генерация конфигураций (QR-коды, файлы .ovpn/.json)
- Просмотр использованного трафика

### 5.5. Админ-панель
- Управление пользователями (создание, редактирование, удаление)
- Управление тарифами (цены, длительность)
- Просмотр всех платежей
- Просмотр всех VPN-аккаунтов
- Базовая статистика (пользователи, доходы)
- Рассылка уведомлений

### 5.6. Мультиязычность
- Поддержка русского, узбекского и английского языков
- Переключение языка в интерфейсе
- Локализация всех надписей
- Форматирование дат и валют в зависимости от языка

### 5.7. Уведомления
- Telegram-бот для уведомлений администратору
- Email-уведомления пользователям
- Внутренние уведомления в системе
- Возможность реализации telegram бота как одного из каналов продаж ключей, с дублированием функций ЛК.

## 6. Нефункциональные требования

### 6.1. Производительность
- Время отклика API не более 2 секунд
- Загрузка страницы не более 3 секунд
- Поддержка до 1000+ одновременных пользователей

### 6.2. Безопасность
- Защита от SQL-инъекций (Prisma)
- Защита от XSS атак (Helmet.js)
- Защита от CSRF атак (JWT с ограничением времени)
- JWT с коротким сроком действия
- Шифрование паролей (bcrypt)
- Rate limiting (express-rate-limit)

### 6.3. Надежность
- Резервное копирование данных
- Мониторинг состояния системы (Sentry)
- Обработка ошибок без падения системы
- Логирование всех важных действий

## 7. CI/CD Pipeline

### 7.1. CI (Continuous Integration)
- Автоматическая проверка кода при пуше в ветку
- Запуск линтера (ESLint)
- Запуск форматера (Prettier)
- Запуск юнит-тестов
- Проверка типов TypeScript
- Проверка Zod валидаций
- Сборка Docker-образов
- Сканирование на уязвимости

### 7.2. CD (Continuous Deployment)
- Автоматический деплой на продакшен сервер при пуше в main ветку
- Обновление Docker-контейнеров
- Перезапуск приложения
- Уведомление в Telegram о деплое
- Резервное копирование перед деплоем (опционально)

## 8. Развертывание на VPS

### 8.1. Требования к VPS
- Ubuntu 20.04 или выше
- Минимум 2GB RAM, 2 CPU
- Доступ по SSH
- Открытые порты 80, 443, 22

### 8.2. Установка
- Установка Docker и Docker Compose
- Клонирование репозитория
- Настройка .env файлов
- Запуск docker-compose
- Настройка SSL (через Let's Encrypt)

## 9. База данных (PostgreSQL + Prisma)

### 9.1. Структура моделей Prisma

#### User
- id (String, @id, @default(cuid()))
- email (String, @unique)
- password_hash (String)
- first_name (String)
- last_name (String)
- language (String, @default('ru')) // 'ru', 'uz', 'en'
- created_at (DateTime, @default(now()))
- updated_at (DateTime, @updatedAt)
- subscriptions (Subscription[])

#### Subscription
- id (String, @id, @default(cuid()))
- user_id (String, @unique)
- plan_name (String)
- price (Decimal)
- currency (String, @default('USD'))
- start_date (DateTime)
- end_date (DateTime)
- status (String, @default('active')) // 'active', 'expired', 'cancelled'
- created_at (DateTime, @default(now()))
- user (User @relation(fields: [user_id], references: [id]))
- vpn_accounts (VpnAccount[])

#### VpnAccount
- id (String, @id, @default(cuid()))
- user_id (String)
- subscription_id (String)
- marzban_user_id (String)
- server_id (String) // ID сервера в MarzBan
- username (String, @unique)
- password (String?)
- created_at (DateTime, @default(now()))
- expires_at (DateTime)
- user (User @relation(fields: [user_id], references: [id]))
- subscription (Subscription @relation(fields: [subscription_id], references: [id]))

#### PaymentLog
- id (String, @id, @default(cuid()))
- user_id (String)
- amount (Decimal)
- currency (String)
- provider (String) // 'click', 'payme'
- transaction_id (String)
- status (String) // 'pending', 'completed', 'failed'
- created_at (DateTime, @default(now()))
- user (User @relation(fields: [user_id], references: [id]))

#### PricingPlan
- id (String, @id, @default(cuid()))
- name (String)
- duration_days (Int)
- price (Decimal)
- currency (String, @default('USD'))
- is_active (Boolean, @default(true))
- created_at (DateTime, @default(now()))

## 10. API endpoints

### 10.1. Public API (для фронтенда)
- POST /api/auth/register - регистрация
- POST /api/auth/login - вход
- POST /api/auth/refresh - обновление токена
- POST /api/auth/forgot-password - восстановление пароля
- GET /api/pricing-plans - получение тарифов
- POST /api/payments/create - создание платежа
- GET /api/webhooks/payment/:provider - webhook от платежных систем

### 10.2. User API
- GET /api/user/profile - профиль пользователя
- PUT /api/user/profile - обновление профиля
- GET /api/user/subscriptions - список подписок
- GET /api/user/vpn-configs - список VPN-конфигураций
- POST /api/user/subscriptions/purchase - покупка подписки
- PUT /api/user/subscriptions/:id/cancel - отмена подписки

### 10.3. Admin API
- GET /api/admin/users - список пользователей
- GET /api/admin/subscriptions - список всех подписок
- GET /api/admin/payments - список всех платежей
- PUT /api/admin/users/:id - редактирование пользователя
- DELETE /api/admin/users/:id - удаление пользователя
- POST /api/admin/pricing-plans - создание тарифа
- PUT /api/admin/pricing-plans/:id - редактирование тарифа

## 11. Мультиязычность

### 11.1. Языки
- Русский (ru)
- Узбекский (uz)
- Английский (en)

### 11.2. Локализация
- Файлы локализации в форматах JSON
- Автоматическое определение языка по браузеру
- Возможность ручного переключения языка
- Локализация дат, времени, чисел

## 12. Интеграции

### 12.1. MarzBan
- Создание VPN-аккаунтов через API
- Получение статуса и трафика
- Удаление аккаунтов при окончании подписки

### 12.2. Click.uz
- Интеграция через официальный SDK
- Обработка webhook'ов
- Проверка статуса платежей

### 12.3. Payme.uz
- Интеграция через официальный протокол
- Обработка webhook'ов
- Проверка статуса платежей

### 12.4. Telegram Bot
- Уведомления администратору
- Возможность базового управления через бота
- Возможность реализации telegram бота как одного из каналов продаж ключей, с дублированием функций ЛК

## 13. Мониторинг и логирование

- Sentry для отслеживания ошибок
- Логирование всех важных действий
- Логирование ошибок
- Мониторинг состояния приложения
- Алерты при падениях

## 14. Безопасность

- Защита всех эндпоинтов JWT-токенами
- Валидация всех входящих данных через Zod
- express-rate-limit для защиты от частых запросов
- Helmet.js для security headers
- Защита от SQL-инъекций через Prisma
- Шифрование чувствительных данных

## 15. Тестирование

- Юнит-тесты для бизнес-логики
- Интеграционные тесты для API
- Тесты валидаций Zod
- Тесты интеграций с внешними сервисами
- Базовые e2e тесты для критичных функций

## 16. Документация

- README.md с инструкцией по запуску
- Документация по API
- Руководство администратора
- Руководство пользователя