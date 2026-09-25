include .env
export

export PROJECT_ROOT=$(CURDIR)

env-up:
	@docker compose up -d kwizly-postgres

env-down:
	@docker compose down kwizly-postgres

env-cleanup:
	@chcp 65001 >nul
	@powershell -NoProfile -Command "$$ans = Read-Host 'Очистить все volume файлы окружения? Опасность утери данных. [y/N]'; if ($$ans -eq 'y' -or $$ans -eq 'Y') { docker compose down kwizly-postgres; if ($$LASTEXITCODE -eq 0) { if (Test-Path 'out/pgdata') { Remove-Item -Recurse -Force 'out/pgdata' }; Write-Host 'Файлы окружения очищены' } } else { Write-Host 'Очистка окружения отменена' }"

env-port-forward:
	@docker compose up -d port-forwarder

env-port-close:
	@docker compose down port-forwarder

migrate-create:
	@chcp 65001 >nul
ifeq ($(strip $(seq)),)
	@echo Отсутствует необходимый параметр seq. Пример: make migrate-create seq=init
	@exit /b 1
else
	@docker compose run --rm kwizly-postgres-migrate create -ext sql -dir /migrations -seq "$(seq)"
endif

migrate-up:
	@$(MAKE) migrate-action action=up

migrate-down:
	@$(MAKE) migrate-action action=down

migrate-action:
ifeq ($(strip $(action)),)
	@chcp 65001 >nul
	@echo Отсутствует необходимый параметр action. Пример: make migrate-action action=up
	@exit /b 1
else
	@chcp 65001 >nul
	@docker compose run --rm kwizly-postgres-migrate -path /migrations -database "postgres://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@kwizly-postgres:5432/$(POSTGRES_DB)?sslmode=disable" $(action)
endif

redis-up:
	@docker compose up -d kwizly-redis

redis-down:
	@docker compose down kwizly-redis

todoapp-run:
	@powershell -NoProfile -Command "$$env:LOGGER_FOLDER='$(PROJECT_ROOT)/out/logs'; go mod tidy; if ($$LASTEXITCODE -ne 0) { exit $$LASTEXITCODE }; go run cmd/todoapp/main.go"
