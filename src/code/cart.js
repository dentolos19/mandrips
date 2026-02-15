import { getProductsColors } from "./database.js";

class Cart {
  /**
   *
   * @param {number} id
   * @param {string} color
   * @param {string} size
   * @param {number} quantity
   */
  constructor(id, color, size, quantity) {
    this.id = id;
    this.color = color;
    this.size = size;
    this.quantity = quantity;
  }

  increment() {
    this.quantity++;
  }

  decrement() {
    this.quantity--;
  }
}

/**
 *
 * @returns {Cart[]}
 */
export function getCart() {
  return (JSON.parse(localStorage.getItem("cart")) || []).map((data) => {
    return new Cart(data.id, data.color, data.size, data.quantity);
  });
}

/**
 *
 * @param {Cart[]} cart
 */
export function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem("cart");
}

/**
 *
 * @param {Cart} item
 */
export function pushCart(item) {
  const cart = getCart();
  if (
    cart.some((cartItem) => cartItem.id === item.id && cartItem.color === item.color && cartItem.size === item.size)
  ) {
    const cartItem = cart.find(
      (cartItem) => cartItem.id === item.id && cartItem.color === item.color && cartItem.size === item.size,
    );
    cartItem.quantity = Number.parseInt(cartItem.quantity) + Number.parseInt(item.quantity);
  } else {
    cart.push(item);
  }
  setCart(cart);
}

/**
 *
 * @param {Cart} item
 */
export function popCart(item) {
  const cart = getCart();
  const newCart = cart.filter((cartItem) => {
    return cartItem.id !== item.id || cartItem.color !== item.color || cartItem.size !== item.size;
  });
  setCart(newCart);
}

export function getCartTotal() {
  const cart = getCart();
  let cartTotal = 0;
  return getProductsColors().then((products) => {
    for (const item of cart) {
      const product = products.find((product) => product.id.toString() === item.id.toString());
      cartTotal += product.price * item.quantity;
    }
    return cartTotal;
  });
}
