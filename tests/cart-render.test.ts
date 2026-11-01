import { test } from "bun:test";
import { strict as assert } from "node:assert";

const scenario = process.argv[2];

if (scenario === "clear-before-load" || scenario === "unavailable-only") {
  class TestElement {
    children: TestElement[] = [];
    listeners = new Map<string, () => void>();
    textContent = "";
    disabled = false;
    private markup = "";

    set innerHTML(value: string) {
      this.markup = value;
      this.children = [];
    }
    get innerHTML() {
      return this.markup;
    }
    addEventListener(name: string, listener: () => void) {
      this.listeners.set(name, listener);
    }
    appendChild(child: TestElement) {
      this.children.push(child);
    }
  }

  const elements = new Map(
    [".items", "#subtotal", "#estimatedTax", "#total", "#checkoutButton", "#clearButton"].map((selector) => [
      selector,
      new TestElement(),
    ]),
  );
  const itemList = elements.get(".items");
  const checkout = elements.get("#checkoutButton");
  const clear = elements.get("#clearButton");
  const total = elements.get("#total");
  assert(itemList && checkout && clear && total);
  let finishRender = () => {};
  const rendered = new Promise<void>((resolve) => {
    finishRender = resolve;
  });
  let checkoutDisabled = false;
  Object.defineProperty(checkout, "disabled", {
    get: () => checkoutDisabled,
    set: (value: boolean) => {
      checkoutDisabled = value;
      finishRender();
    },
  });

  const storage = new Map<string, string>();
  storage.set(
    "cart",
    JSON.stringify([{ id: scenario === "unavailable-only" ? 99 : 1, color: "Blue", size: "Medium", quantity: 1 }]),
  );
  Object.defineProperty(globalThis, "document", {
    value: { querySelector: (selector: string) => elements.get(selector), createElement: () => new TestElement() },
  });
  Object.defineProperty(globalThis, "localStorage", {
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    },
  });
  Object.defineProperty(globalThis, "confirm", { value: () => true });
  let resolveCatalog: (response: Response) => void = () => {
    throw new Error("Catalog request did not start.");
  };
  const pendingCatalog = new Promise<Response>((resolve) => {
    resolveCatalog = resolve;
  });
  Object.defineProperty(globalThis, "fetch", { value: () => pendingCatalog });

  await import("../src/code/pages/cart");
  if (scenario === "clear-before-load") clear.listeners.get("click")?.();
  resolveCatalog(
    Response.json([
      {
        id: 1,
        type: "shirt",
        name: "Shirt",
        price: 10,
        description: "Demo",
        colors: [{ name: "Blue", url: "/blue.png" }],
      },
    ]),
  );
  const timeout = setTimeout(() => {
    throw new Error("Cart rendering did not finish.");
  }, 1000);
  await rendered;
  clearTimeout(timeout);
  await Bun.sleep(0);

  assert.equal(total.textContent, "$0.00");
  assert.equal(checkout.disabled, true);
  if (scenario === "clear-before-load") {
    assert.equal(storage.has("cart"), false);
    assert.match(itemList.innerHTML, /cart is empty/i);
    assert.equal(itemList.children.length, 0);
  } else {
    assert.match(itemList.children[0]?.textContent ?? "", /unavailable/i);
  }
} else {
  for (const mode of ["clear-before-load", "unavailable-only"]) {
    test(`cart render: ${mode}`, async () => {
      // Run in a fresh process so the catalog cache and DOM globals cannot leak between test files.
      const child = Bun.spawn({ cmd: [process.execPath, import.meta.path, mode], stdout: "ignore", stderr: "pipe" });
      const [exitCode, error] = await Promise.all([child.exited, new Response(child.stderr).text()]);
      if (exitCode !== 0) throw new Error(error);
    });
  }
}
