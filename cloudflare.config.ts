import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "mandrips",
    compatibilityDate: "2026-10-01",
    observability: {
      logs: {
        enabled: true,
      },
      traces: {
        enabled: true,
      },
      issues: {
        enabled: true,
      },
    },
    assets: {
      notFoundHandling: "single-page-application",
    },
    domains: ["mandrips.dennise.me"],
  },
});
