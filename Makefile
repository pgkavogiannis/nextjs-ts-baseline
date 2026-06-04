.PHONY: lint typecheck build ci

lint:
	yarn lint

typecheck:
	yarn tsc --noEmit

build:
	yarn build

ci: lint typecheck build
