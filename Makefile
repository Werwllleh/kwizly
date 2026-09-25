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

redis-up:
	@docker compose up -d kwizly-redis

redis-down:
	@docker compose down kwizly-redis

minio-up:
	@docker compose up -d kwizly-minio

minio-down:
	@docker compose down kwizly-minio

kwizly-start:
	@docker compose up -d kwizly-postgres kwizly-redis kwizly-minio port-forwarder

kwizly-stop:
	@docker compose down kwizly-postgres kwizly-redis kwizly-minio port-forwarder
