import { afterAll, beforeEach, expect, test } from "bun:test";

import { clearCart, getCart, getCartTotal, popCart, pushCart, setCart } from "../src/code/cart";

const storage = new Map<string, string>();
const previousStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
const previousFetch = globalThis.fetch;
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  },
});
globalThis.fetch = Object.assign(
  async () =>
    Response.json([
      {
        id: 1,
        type: "shirt",
        name: "Shirt",
        price: 10.9,
        description: "Demo",
        colors: [{ name: "Blue", url: "/blue.png" }],
      },
    ]),
  { preconnect: previousFetch.preconnect },
);
afterAll(() => {
  if (previousStorage) Object.defineProperty(globalThis, "localStorage", previousStorage);
  else Reflect.deleteProperty(globalThis, "localStorage");
  globalThis.fetch = previousFetch;
});
beforeEach(() => storage.clear());
const item = { id: 1, color: "Blue", size: "Medium", quantity: 2 };

test("legacy string quantities normalize and malformed records cannot break the cart", () => {
  storage.set("cart", "{");
  expect(getCart()).toEqual([]);
  storage.set(
    "cart",
    JSON.stringify([
      { ...item, id: "1", quantity: "2" },
      null,
      { ...item, quantity: -1 },
      { ...item, quantity: "2garbage" },
    ]),
  );
  expect(getCart()).toEqual([item]);
  pushCart(item);
  expect(getCart()[0]?.quantity).toBe(4);
});

test("removed products stay removed when another product is updated", () => {
  const other = { ...item, size: "Large" };
  setCart([item, other]);
  popCart(item);
  pushCart(other);
  expect(getCart()).toEqual([{ ...other, quantity: 4 }]);
  clearCart();
  expect(getCart()).toEqual([]);
});

test("totals ignore stale products and invalid colors, rejecting invalid additions", async () => {
  setCart([item, { ...item, id: 99 }, { ...item, color: "Missing" }]);
  expect(await getCartTotal()).toBeCloseTo(21.8);
  expect(() => pushCart({ ...item, quantity: 0 })).toThrow();
  setCart([{ ...item, quantity: Number.MAX_SAFE_INTEGER }]);
  expect(() => pushCart(item)).toThrow();
});
