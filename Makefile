.PHONY: $(MAKECMDGOALS)

DB_CONTAINER = $(shell docker ps -aqf "name=bichard7-next_pg")
DB_HOST = $(shell docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(DB_CONTAINER))

build:
	./scripts/build-docker.sh

run:
	docker run -p 4080:443 -e DB_HOST=$(DB_HOST) ui

goss:
	GOSS_SLEEP=15 dgoss run -e DB_HOST=$(DB_HOST) "ui:latest"
