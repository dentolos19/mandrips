import { watch } from "node:fs";
import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";

const transpiler = new Bun.Transpiler({ loader: "ts", target: "browser" });

async function build() {
  await rm("dist", { recursive: true, force: true });
  await cp("src", "dist", { recursive: true, filter: (path) => !path.endsWith(".ts") });
  for (const path of await readdir("src/code", { recursive: true })) {
    if (!path.endsWith(".ts")) continue;
    const output = join("dist/code", path.replace(/\.ts$/, ".js"));
    await mkdir(dirname(output), { recursive: true });
    await Bun.write(output, transpiler.transformSync(await Bun.file(join("src/code", path)).text()));
  }
}

await build();
if (process.argv.includes("--watch")) {
  let rebuilding = false;
  let pending = false;
  watch("src", { recursive: true }, async () => {
    pending = true;
    if (rebuilding) return;
    rebuilding = true;
    try {
      while (pending) {
        pending = false;
        await build();
      }
    } catch (error) {
      console.error(error);
    } finally {
      rebuilding = false;
    }
  });
  const server = Bun.spawn(["bun", "run", "cf", "dev"], { stdout: "inherit", stderr: "inherit", stdin: "inherit" });
  for (const signal of ["SIGINT", "SIGTERM"] as const)
    process.on(signal, () => {
      server.kill(signal);
      process.exit(0);
    });
  process.exit(await server.exited);
}
