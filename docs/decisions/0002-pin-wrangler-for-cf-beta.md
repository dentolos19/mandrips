# 0002. Pin Wrangler for Cf Beta

- Status: Accepted
- Date: 2026-11-28

## Context

`cf build` in the pinned `cf` 1.0.0-beta.26 CLI delegates to the project's Wrangler and reads its build output from `.cloudflare/output/v0`. Wrangler 4.163.0 and later write version `v1` of the build output specification instead, so `cf build` fails with "no root config found".

## Decision

Pin `wrangler` to exactly `4.162.0`, the last release that writes `v0` output. Upgrading `cf` to its release candidate was not chosen because it is a larger jump than a routine dependency update.

## Consequences

- Wrangler stays on 4.162.0 until `cf` is upgraded to a version that reads `v1` output.
- When upgrading `cf`, remove the exact pin and supersede this record.
