import { type CartItem, clearCart, getCart, getCartTotal, popCart, setCart } from "../cart.js";
import { getProductsColors } from "../database.js";
import { element } from "../utils.js";

const e_items = element(".items");
const e_subtotal = element("#subtotal");
const e_estimatedTax = element("#estimatedTax");
const e_total = element("#total");
const e_checkoutButton = element<HTMLButtonElement>("#checkoutButton");
const e_clearButton = element("#clearButton");

async function loadCart() {
  const products = await getProductsColors();
  const cart = getCart();
  const available = cart.filter((item) =>
    products.some((product) => product.id === item.id && product.colorName === item.color),
  );
  const total = available.reduce(
    (sum, item) =>
      sum +
      products.find((product) => product.id === item.id && product.colorName === item.color)!.price * item.quantity,
    0,
  );
  const subtotal = total / 1.09;
  e_subtotal.textContent = `$${subtotal.toFixed(2)}`;
  e_estimatedTax.textContent = `$${(total - subtotal).toFixed(2)}`;
  e_total.textContent = `$${total.toFixed(2)}`;
  e_checkoutButton.disabled = available.length === 0;

  if (!(cart.length > 0)) {
    e_items.innerHTML = "<p class='empty'>Your cart is empty! Let's get shopping!</p>";
    return;
  }

  e_items.innerHTML = "";
  if (available.length !== cart.length) {
    const notice = document.createElement("p");
    notice.textContent = "Some saved products are unavailable. Clear your cart to remove them.";
    e_items.appendChild(notice);
  }
  for (const item of cart) {
    const productColor = products.find((product) => product.id === item.id && product.colorName === item.color);

    if (!productColor) continue;

    const getItemPrice = () => `$${(productColor.price * item.quantity).toFixed(2)}`;
    const getItemLabel = () => `${productColor.colorName} • ${item.size} • Quantity: ${item.quantity}`;

    const e_item = document.createElement("div");
    e_item.className = "item";

    const e_image = document.createElement("img");
    e_image.className = "image";
    e_image.src = productColor.colorUrl;
    e_image.alt = productColor.name;

    const e_info = document.createElement("div");
    e_info.className = "info";

    const e_info_title = document.createElement("a");
    e_info_title.className = "title";
    e_info_title.textContent = productColor.name;
    e_info_title.href = `/product.html?${new URLSearchParams({ id: String(item.id), color: productColor.colorName, size: item.size })}`;

    const e_info_subtitle = document.createElement("div");
    e_info_subtitle.className = "subtitle";
    e_info_subtitle.textContent = getItemLabel();

    const e_info_actions = document.createElement("div");
    e_info_actions.className = "actions";

    const e_info_actions_increment = document.createElement("button");
    e_info_actions_increment.className = "increment";
    e_info_actions_increment.innerHTML = "<i class='fa-solid fa-plus'></i>";
    e_info_actions_increment.title = "Increment";
    e_info_actions_increment.addEventListener("click", () => {
      changeQuantity(item, 1);
    });

    const e_info_actions_decrement = document.createElement("button");
    e_info_actions_decrement.className = "decrement";
    e_info_actions_decrement.innerHTML = "<i class='fa-solid fa-minus'></i>";
    e_info_actions_decrement.title = "Decrement";
    e_info_actions_decrement.addEventListener("click", () => {
      if (item.quantity === 1 && !confirm("Are you sure you want to delete this item?")) return;
      changeQuantity(item, -1);
    });

    const e_info_actions_remove = document.createElement("button");
    e_info_actions_remove.className = "remove";
    e_info_actions_remove.innerHTML = "<i class='fa-solid fa-trash'></i>";
    e_info_actions_remove.title = "Delete";
    e_info_actions_remove.addEventListener("click", () => {
      const confirmation = confirm("Are you sure you want to delete this item?");
      if (!confirmation) return;
      popCart(item);
      refreshCart();
    });

    e_info_actions.appendChild(e_info_actions_increment);
    e_info_actions.appendChild(e_info_actions_decrement);
    e_info_actions.appendChild(e_info_actions_remove);

    e_info.appendChild(e_info_title);
    e_info.appendChild(e_info_subtitle);
    e_info.appendChild(e_info_actions);

    const e_price = document.createElement("div");
    e_price.className = "price";
    e_price.textContent = getItemPrice();

    e_item.appendChild(e_image);
    e_item.appendChild(e_info);
    e_item.appendChild(e_price);

    e_items.appendChild(e_item);
  }
}

async function handleCheckout() {
  try {
    if ((await getCartTotal()) <= 0) {
      alert("Your cart has no available products!");
      return;
    }
    location.href = "/checkout.html";
  } catch {
    alert("Could not load cart. Please try again.");
  }
}

function handleClear() {
  const cart = getCart();
  if (cart.length <= 0) {
    alert("Your cart is already empty!");
    return;
  }
  const confirmation = confirm("Are you sure you want to clear your cart?");
  if (!confirmation) return;
  clearCart();
  refreshCart();
}

e_checkoutButton.addEventListener("click", handleCheckout);
e_clearButton.addEventListener("click", handleClear);

refreshCart();

function changeQuantity(item: CartItem, change: number) {
  const cart = getCart();
  const current = cart.find((entry) => entry.id === item.id && entry.color === item.color && entry.size === item.size);
  if (!current) return;
  const quantity = current.quantity + change;
  if (!Number.isSafeInteger(quantity)) return;
  if (quantity <= 0) popCart(current);
  else {
    current.quantity = quantity;
    setCart(cart);
  }
  refreshCart();
}

function refreshCart() {
  loadCart().catch(() => {
    e_items.textContent = "Could not load cart. Please try again.";
  });
}
