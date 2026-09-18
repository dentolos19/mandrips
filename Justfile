set dotenv-load

setup: install

install:
    bun install --frozen-lockfile

start:
    bun run dev

check:
    bun run check

deploy: install
    bun wrangler deploy
