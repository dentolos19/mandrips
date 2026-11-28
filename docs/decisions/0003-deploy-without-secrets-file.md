# 0003. Deploy Without Secrets File

- Status: Accepted
- Date: 2026-11-28

## Context

The conventions list every variable in `.env.template`, write the dotenv file in the deploy workflow with `SpicyPizza/create-envfile`, and have `just deploy` require that file and pass it to `cf deploy` as the secrets file. The storefront is static and reads no variables, so the file would be empty, and Wrangler, which `cf deploy` delegates to, rejects an empty dotenv secrets file with "The contents of ... is not valid".

## Decision

Omit `.env.template` and the workflow's secrets step, and deploy with `cf deploy --prebuilt` without requiring or uploading a dotenv file. Adding a placeholder variable to satisfy the check was rejected because the site would never read it.

## Consequences

- `just deploy` works without a local `.env` file.
- When the site first reads a variable, add `.env.template`, the workflow's `Download Secrets` step, and the `test -f` check and `--secrets-file` flag in `just deploy`, then supersede this record.
