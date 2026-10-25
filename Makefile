.PHONY: lint typecheck test build ci

lint:
	yarn lint

typecheck:
	@if [ -z "$$(find . \( -name node_modules -o -name .next -o -name out \) -prune -o \( -name '*.ts' -o -name '*.tsx' \) -print -quit)" ]; then \
		echo "typecheck: no .ts/.tsx sources yet, skipping"; \
	else \
		yarn tsc --noEmit; \
	fi

test:
	yarn test:coverage

build:
	@if [ ! -d app ] && [ ! -d pages ] && [ ! -d src/app ] && [ ! -d src/pages ]; then \
		echo "build: no app/ or pages/ directory yet, skipping"; \
	else \
		yarn build; \
	fi

ci: lint typecheck test build
