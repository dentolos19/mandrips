import { defineWranglerConfig } from "wrangler/experimental-config";

export default defineWranglerConfig({
  dev: {
    port: 3000,
  },
  types: {
    generate: false,
  },
  assetsDirectory: "dist",
});
