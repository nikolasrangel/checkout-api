test-unit:
	@TEST_TYPE=unit docker-compose up --exit-code-from tests tests

test-integration:
	@TEST_TYPE=integration docker-compose up --exit-code-from tests tests

test-functional:
	@TEST_TYPE=functional docker-compose up --exit-code-from tests tests
