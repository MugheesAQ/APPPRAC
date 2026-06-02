.PHONY: up down restart logs backend-shell db-migrate db-seed clean help

# Default help panel
help:
	@echo "=========================================================================="
	@echo "             CITIZEN PORTAL LINUX DEPLOYMENT COMMANDS                     "
	@echo "=========================================================================="
	@echo "make up             - Build and start all services in detached mode"
	@echo "make down           - Stop and remove all containers, networks, and volumes"
	@echo "make restart        - Restart all running services"
	@echo "make logs           - Tail running service logs"
	@echo "make backend-shell  - Spawn an active Alpine terminal shell inside API server"
	@echo "make db-migrate     - Run Prisma deploy database migrations on Postgres"
	@echo "make db-seed        - Execute database seed scripts for default catalogs"
	@echo "make clean          - Delete local build and node folders"
	@echo "=========================================================================="

up:
	docker compose up -d --build

down:
	docker compose down -v

restart:
	docker compose restart

logs:
	docker compose logs -f

backend-shell:
	docker compose exec backend sh

db-migrate:
	docker compose exec backend npx prisma migrate deploy

db-seed:
	docker compose exec backend npx prisma db seed

clean:
	rm -rf backend/node_modules backend/dist frontend/node_modules frontend/dist
