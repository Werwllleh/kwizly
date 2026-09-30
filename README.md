# KWIZLY 

#####  !ВНИМАНИЕ PET!

Kahoot-подобная платформа: ведущий создаёт квиз, игроки подключаются по коду, отвечают в реальном времени, очки считаются с учётом скорости, есть лидерборд. Играть можно с веба и из Telegram WebApp / бота.

Проект для отработки backend навыков и изучения новых инструментов.


## СТЭК
- NestJS + Prisma
- PostgreSQL + Redis
- Socket.IO
- BullMQ 
- Turborepo 
- Vitest / Jest


**Статус:** в разработке (Фаза 1 — скелет проекта)

## Что уже готово
- [x] Репозиторий, README
- [x] Монорепа и docker-compose
- [ ] Auth
- [ ] CRUD квизов
- [ ] WebSocket-игровой движок

## Как запустить

1. `pnpm install`
2. `make kwizly-start` — поднимет Postgres, Redis, MinIO и port-forwarder
3. `pnpm nest-dev` — запустит API на http://localhost:3000/api

Проверка: `curl http://localhost:3000/api/health`
