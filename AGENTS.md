# Agent Instructions

Mandrips is a demonstration online clothing storefront built with vanilla HTML, CSS, and TypeScript for the Web Development module at Nanyang Polytechnic. It is served as static assets from a Cloudflare Worker.

## Commands

- `just setup`: Installs dependencies.
- `just install`: Installs dependencies from the frozen lockfile.
- `just start`: Builds in watch mode and serves the site locally with `cf dev`.
- `just build`: Builds the site into `dist`.
- `just check`: Lints, formats, and type-checks.
- `just test`: Runs the Bun tests.
- `just deploy`: Installs, builds, and deploys the prebuilt assets.

## Stack

Static HTML pages with plain CSS and TypeScript browser modules, built by a custom Bun script and deployed to Cloudflare Workers with the `cf` CLI.

## Rules

- Author browser modules in `src/code/**/*.ts` and reference them from pages by their `/code/*.js` URLs.
- Use relative `.js` imports between browser modules, since they are not bundled; use `#/*` only in tests and scripts. See [0001](docs/decisions/0001-custom-bun-build-with-cf-cli.md).
- Keep `.env.template` and the workflow's secrets step out until the site reads a variable. See [0003](docs/decisions/0003-deploy-without-secrets-file.md).

## Documentation

- [Product Specifications](PRODUCT.md)
- [Design System](DESIGN.md)
- [Documentation Guidelines](docs/README.md)
- [Cloudflare Development](docs/guides/cloudflare.md)
