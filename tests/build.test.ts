import { expect, test } from "bun:test";
import { readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

test("browser assets retain their URLs and every emitted module import resolves", async () => {
  const build = Bun.spawn(["bun", "scripts/build.ts"], { stdout: "pipe", stderr: "pipe" });
  expect(await build.exited).toBe(0);
  const paths = await readdir("dist", { recursive: true });
  expect(paths.some((path) => path.endsWith(".ts"))).toBe(false);
  for (const path of paths.filter((path) => path.endsWith(".html") || path.endsWith(".js"))) {
    const source = await Bun.file(join("dist", path)).text();
    const refs = path.endsWith(".html")
      ? source.matchAll(/src="(\/code\/[^"]+\.js)"/g)
      : source.matchAll(/from "(\.[^"]+)"/g);
    for (const match of refs) {
      const reference = match[1]!;
      const target = reference.startsWith("/") ? join("dist", reference) : resolve("dist", dirname(path), reference);
      expect(await Bun.file(target).exists()).toBe(true);
    }
  }
});
