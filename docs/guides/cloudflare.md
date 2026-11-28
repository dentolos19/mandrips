# Cloudflare Development

## Configuration

The static site uses the pinned `cf` beta CLI with [`cloudflare.config.ts`](../../cloudflare.config.ts) for its Worker identity, custom domain, observability, and single-page-app fallback. [`wrangler.config.ts`](../../wrangler.config.ts) uses the generated `dist` asset directory and local port 3000 for the Wrangler bundler used by `cf`. Wrangler remains a build dependency, pinned to match the `cf` beta. See [0001](../decisions/0001-custom-bun-build-with-cf-cli.md) and [0002](../decisions/0002-pin-wrangler-for-cf-beta.md).

Generated Cloudflare build output and local state are ignored in `.cloudflare/`.

## Deployment

`just deploy` installs, builds, and uploads the prebuilt assets. The site reads no variables, so it has no `.env.template`, and deployment neither requires nor uploads a dotenv file. See [0003](../decisions/0003-deploy-without-secrets-file.md).

The `environment` selector chooses `.env` by default, or `.env.<name>` when set, and gives the file precedence over inherited values. It does not change the Worker or domain. Cloudflare account and API credentials come from the process environment, or from repository secrets in the GitHub `Production` environment.

## Browser Modules

Browser modules are authored in `src/code/**/*.ts`. The [Bun build](../../scripts/build.ts) strips their types and copies static files into `dist`, keeping the existing `/code/*.js` URLs. Local development rebuilds these assets when sources change, and `cf dev` serves the generated site.
