.PHONY: $(MAKECMDGOALS)

build:
	./scripts/build-docker.sh

run:
	docker run -p 4080:443 -e DB_HOST=172.17.0.1 ui

goss:
	GOSS_SLEEP=15 dgoss run -e DB_HOST=172.17.0.1 "ui:latest"
