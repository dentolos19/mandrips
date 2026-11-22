# Agent Instructions

Mandrips is a demonstration online clothing storefront built with vanilla HTML, CSS, and TypeScript. It was made for the Web Development module at Nanyang Polytechnic and is served as static assets from a Cloudflare Worker.

## Stack

Static HTML pages with plain CSS and TypeScript browser modules, built by a custom Bun script and deployed with the `cf` CLI.

## Commands

- `just setup`: Installs dependencies.
- `just start`: Builds in watch mode and serves the site locally with `cf dev`.
- `just build`: Builds the site into `dist`.
- `just check`: Lints, formats, and type-checks.
- `just test`: Runs the Bun tests.
- `just deploy`: Installs, builds, and deploys the prebuilt assets.

## Rules

- Author browser modules in `src/code/**/*.ts` and reference them from pages by their `/code/*.js` URLs.

## Documents

- [Product Specifications](PRODUCT.md)
- [Design System](DESIGN.md)
- [Documentation Guidelines](docs/README.md)
- [Cloudflare Development](docs/guides/cloudflare.md)
