# 0001. Custom Bun Build With Cf CLI

- Status: Accepted
- Date: 2026-11-01

## Context

The storefront is a static multi-page site whose browser modules were plain JavaScript under `src/code/`, served by a standalone Bun static server. The modules moved to TypeScript, and the pages reference them by their existing `/code/*.js` URLs.

## Decision

- Build with a small custom script, [`scripts/build.ts`](../../scripts/build.ts), that copies `src` into `dist` and strips types from each `src/code/**/*.ts` module with `Bun.Transpiler`, without bundling, so the `/code/*.js` URLs and relative module imports stay unchanged.
- Configure and deploy the Worker with the pinned `cf` beta CLI and [`cloudflare.config.ts`](../../cloudflare.config.ts), with [`wrangler.config.ts`](../../wrangler.config.ts) supplying the asset directory and local port for the Wrangler bundler that `cf` uses.
- Remove the standalone Bun static server; `cf dev` serves the generated site locally.

## Consequences

- Wrangler remains a build dependency.
- [`tests/build.test.ts`](../../tests/build.test.ts) checks that no TypeScript reaches `dist` and that every emitted module import resolves.
