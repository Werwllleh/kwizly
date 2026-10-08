# AGENTS.md — Kwizly

## Команды
- **Запуск инфраструктуры**: `make kwizly-start` (Postgres, Redis, MinIO, порт-форвардер)
- **Остановка инфраструктуры**: `make kwizly-stop`
- **Запуск API (Dev)**: `pnpm nest-dev` (или `pnpm --filter @kwizly/api start:dev`)
- **Сборка API**: `pnpm nest-build`
- **Линтинг API**: `pnpm lint`
- **Генерация Prisma**: `pnpm prisma-generate`
- **Миграции Prisma**: `pnpm prisma-migrate <имя_миграции>`

## Архитектура и особенности
- **Монорепо**: pnpm workspaces + Turborepo. Основное приложение — `@kwizly/api` в каталоге `apps/api`.
- **Порты и инфраструктура**:
  - Postgres: локальный контейнер проброшен на `127.0.0.1:25432` через socat порт-форвардер.
  - Redis: проброшен на `127.0.0.1:26379`.
  - MinIO: проброшен на `127.0.0.1:29000` / `29001`.
- **Prisma**: Настроена с выводом клиента в `apps/api/src/generated/prisma`. Всегда запускайте `pnpm prisma-generate` после изменений в схеме.

## Текущий прогресс (Фаза 1 — Скелет)
- [x] Структура монорепо и окружение Docker Compose (Postgres, Redis, MinIO, порт-форвардер)
- [x] Настройка Prisma ORM с начальными миграциями и моделью User
- [x] Скелет NestJS API (`Health`-модуль, `User`-модуль с базовым CRUD, Zod-пайп валидации, логирующий интерцептор, middleware авторизации и логирования)

## В работе (Фаза 2 — Аутентификация и сессии)
### Текущее задание:
1. **Обновление схемы Prisma (`apps/api/prisma/schema.prisma`)**:
   - Перевести `User.id` с `Int` на `String @id @default(uuid())`.
   - Добавить в `User` поля аудита: `createdAt DateTime @default(now())` и `updatedAt DateTime @updatedAt`.
   - Создать модель `Session`:
     - `id String @id @default(uuid())`
     - `userId String`
     - `user User @relation(fields: [userId], references: [id], onDelete: Cascade)`
     - `hashedToken String`
     - `expiresAt DateTime`
     - `createdAt DateTime @default(now())`
     - `userAgent String?`
     - `ip String?`
2. **Создание и применение миграции Prisma**:
   - `pnpm prisma-migrate auth_sessions` (учитывая смену типов `id`, возможно потребуется сброс dev-базы или адаптация существующих записей).
   - Генерация клиента: `pnpm prisma-generate`.

### Дальнейшие шаги фазы:
- [ ] Хэширование паролей и refresh-токенов (`argon2` / `bcrypt`).
- [ ] Механизм выдачи пар токенов (Access JWT + Refresh Token) и ротации сессий.
- [ ] Guard и Decorators для защиты эндпоинтов (`JwtAuthGuard`, `@CurrentUser()`).
- [ ] Эндпоинты аутентификации: `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`.

## План дальнейшего развития (Roadmap)
1. **Аутентификация**: Реализация JWT токенов, защитных guard-ов, сессий в БД, эндпоинтов регистрации и входа.
2. **Управление квизами (CRUD)**: Расширение схемы Prisma (`Quiz`, `Question`, `Option`), реализация эндпоинтов управления квизами.
3. **WebSocket игровой движок**: Socket.IO шлюз для комнат в реальном времени, машина состояний игры (Лобби -> Вопрос -> Ответ -> Расчет очков -> Таблица лидеров), алгоритм подсчета очков с учетом скорости.
4. **Фоновые задачи и хранилище**: Интеграция BullMQ для асинхронных задач и MinIO для загрузки медиафайлов.
5. **Фронтенд / Telegram WebApp**: Клиентская часть для веба и Telegram Mini App.
