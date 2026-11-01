# Cloudflare development

The static site uses the pinned `cf` beta CLI with `cloudflare.config.ts` for its
Worker identity, custom domain, observability and single-page-app fallback.
`wrangler.config.ts` uses the generated `dist` asset directory and local port 3000 for
the Wrangler bundler used by `cf`. Wrangler remains a build dependency.

Use `just start` to serve the site locally, `just build` to package it, and
`just deploy` to install, build and upload the prebuilt assets. The site has no
application secrets, so deployment does not require an environment file or
upload a secrets file. Supply Cloudflare account/API credentials through the
process environment or the existing GitHub Production environment.

The shared `environment` selector chooses `.env` by default, or `.env.<name>`
when set, and gives the file precedence over inherited values. It does not
change the Worker or domain.

`just check` uses Bun's built-in lint, format and type-check commands. Formatter
options live in `bunfig.toml`, and `.editorconfig` retains the line-width guide.
Generated Cloudflare build output and local state are ignored in `.cloudflare/`.

Browser modules are authored in `src/code/**/*.ts`. The Bun build strips their
types and copies static files into `dist`, keeping the existing `/code/*.js` URLs.
Local development rebuilds these assets when sources change. The old standalone
Bun static server has been removed; `cf dev` serves the generated site.
