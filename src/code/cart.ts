import { getProductsColors } from "./database.js";

export type CartItem = { id: number; color: string; size: string; quantity: number };

function readItem(value: unknown): CartItem | undefined {
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    !("quantity" in value) ||
    !("color" in value) ||
    typeof value.color !== "string" ||
    !value.color ||
    !("size" in value) ||
    typeof value.size !== "string" ||
    !value.size
  )
    return;
  if (
    (typeof value.id !== "string" && typeof value.id !== "number") ||
    (typeof value.quantity !== "string" && typeof value.quantity !== "number")
  )
    return;
  const id = Number(value.id);
  const quantity = Number(value.quantity);
  if (!Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(quantity) || quantity <= 0) return;
  return { id, color: value.color, size: value.size, quantity };
}

export function getCart(): CartItem[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem("cart") ?? "[]");
    return Array.isArray(data)
      ? data.flatMap((value: unknown) => {
          const item = readItem(value);
          return item ? [item] : [];
        })
      : [];
  } catch {
    return [];
  }
}

export function setCart(cart: CartItem[]) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem("cart");
}

export function pushCart(item: CartItem) {
  if (!readItem(item)) throw new Error("Choose a valid product and quantity.");
  const cart = getCart();
  const existing = cart.find((entry) => entry.id === item.id && entry.color === item.color && entry.size === item.size);
  if (existing) {
    if (!Number.isSafeInteger(existing.quantity + item.quantity)) throw new Error("Quantity is too large.");
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  setCart(cart);
}

export function popCart(item: CartItem) {
  setCart(getCart().filter((entry) => entry.id !== item.id || entry.color !== item.color || entry.size !== item.size));
}

export async function getCartTotal() {
  const products = await getProductsColors();
  return getCart().reduce((total, item) => {
    const product = products.find((product) => product.id === item.id && product.colorName === item.color);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}
