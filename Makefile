lint:
	uv run ruff format sugarpy
	uv run ruff check sugarpy --fix
	uv run ruff format api
	uv run ruff check api --fix --unsafe-fixes
