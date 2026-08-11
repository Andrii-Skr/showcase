SHELL := /bin/sh

ENV_FILE ?= .env
WAIT_TIMEOUT ?= 180
CURRENT_RELEASE := $(shell sed -n '1p' .deploy/current-release 2>/dev/null)
RELEASE_TAG ?= $(if $(CURRENT_RELEASE),$(CURRENT_RELEASE),latest)
COMPOSE := RELEASE_TAG=$(RELEASE_TAG) docker compose --env-file $(ENV_FILE) --file docker-compose.yml

.DEFAULT_GOAL := help

.PHONY: help init verify config build pull up down restart ps logs health deploy rollback

help: ## Show available commands
	@awk 'BEGIN {FS = ":.*## "; printf "Usage: make <target>\n\n"} /^[a-zA-Z_-]+:.*## / {printf "  %-12s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

init: ## Create .env from .env.example without overwriting an existing file
	@test -e "$(ENV_FILE)" || cp .env.example "$(ENV_FILE)"
	@chmod 600 "$(ENV_FILE)"
	@printf 'Environment file ready: %s\n' "$(ENV_FILE)"

verify: ## Run lint, types, unit tests, and a production build
	pnpm lint
	pnpm typecheck
	pnpm test
	pnpm build

config: ## Validate the rendered Compose configuration
	$(COMPOSE) config --quiet

build: config ## Build the versioned showcase image
	$(COMPOSE) build --pull showcase

pull: config ## Pull pinned third-party images
	$(COMPOSE) pull analytics analytics-db

up: config ## Start production services and wait until they are healthy
	$(COMPOSE) up -d --remove-orphans --wait --wait-timeout $(WAIT_TIMEOUT)

down: ## Stop services without deleting persistent data
	$(COMPOSE) down --remove-orphans

restart: ## Restart production services and wait until they are healthy
	$(COMPOSE) restart
	$(COMPOSE) up -d --remove-orphans --wait --wait-timeout $(WAIT_TIMEOUT)

ps: ## Show container status
	$(COMPOSE) ps

logs: ## Follow recent logs; use SERVICE=showcase to select one service
	$(COMPOSE) logs --tail=200 --follow $(SERVICE)

health: ## Check health from inside the showcase container
	$(COMPOSE) exec -T showcase wget -q -O - http://127.0.0.1:3000/api/health

deploy: ## Build and deploy; optionally set RELEASE=<docker-tag>
	ENV_FILE="$(ENV_FILE)" WAIT_TIMEOUT="$(WAIT_TIMEOUT)" ./scripts/deploy.sh deploy "$(RELEASE)"

rollback: ## Roll back to the image used before the latest successful deploy
	ENV_FILE="$(ENV_FILE)" WAIT_TIMEOUT="$(WAIT_TIMEOUT)" ./scripts/deploy.sh rollback
