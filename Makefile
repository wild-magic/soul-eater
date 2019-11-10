.PHONY: help

APP_NAME ?= `grep 'app:' mix.exs | sed -e 's/\[//g' -e 's/ //g' -e 's/app://' -e 's/[:,]//g'`
APP_VSN ?= `grep 'version:' mix.exs | cut -d '"' -f2`
BUILD ?= `git rev-parse --short HEAD`

help:
	@echo "$(APP_NAME):$(APP_VSN)-$(BUILD)"
	@perl -nle'print $& if m{^[a-zA-Z_-]+:.*?## .*$$}' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

build: ## Build the release Docker image
	docker build \
		--build-arg APP_NAME=$(APP_NAME) \
		-t $(APP_NAME):$(APP_VSN)-$(BUILD) \
		-t $(APP_NAME):latest .

run: ## Run the release in Docker
	docker run \
		--env-file config/docker.env \
		--expose 4000 -p 4000:4000 \
		--rm -it $(APP_NAME):latest

tests: ## Run the tests in Docker
	docker-compose run --rm  ci

release: ## Build & run the release in Docker
	docker-compose up web

release_exec: ## Get a shell in the already built release in Docker
	docker exec -it beowulf_web_1 bash

release_stop: ## Stop the release Docker container
	docker-compose stop web

dev: ## Run the app as a mix project
	docker-compose run --service-ports dev

dev_create_db: ## Create the db (mix project)
	docker-compose run --rm --service-ports dev mix ecto.create

dev_drop_db: ## Drop the db (mix project)
	docker-compose run --rm --service-ports dev mix ecto.create

dev_migrate_db: ## Migrate the db (mix project)
	docker-compose run --rm --service-ports dev mix ecto.migrate

dev_stop: ## Stop the mix project container
	docker-compose stop dev
