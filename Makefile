test-unit:
	@TEST_TYPE=unit docker-compose up --exit-code-from tests tests

test-integration:
	@TEST_TYPE=integration docker-compose up --exit-code-from tests tests

test-functional:
	@TEST_TYPE=functional docker-compose up --exit-code-from tests tests

test:
	make test-unit && make test-integration && make test-functional

pre-build:
	@cp .env.example .env

docker-build-http-server:
	@docker-compose build --no-cache checkout-http-server

install-dependencies:
	@npm i

build: pre-build docker-build-http-server install-dependencies

start-http-server:
	@docker-compose up checkout-http-server

up:	build start-http-server
