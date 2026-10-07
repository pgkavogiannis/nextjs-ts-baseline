.PHONY: lint typecheck build ci

lint:
	yarn lint

typecheck:
	@if [ -z "$$(find . \( -name node_modules -o -name .next -o -name out \) -prune -o \( -name '*.ts' -o -name '*.tsx' \) -print -quit)" ]; then \
		echo "typecheck: no .ts/.tsx sources yet, skipping"; \
	else \
		yarn tsc --noEmit; \
	fi

build:
	yarn build

ci: lint typecheck build
