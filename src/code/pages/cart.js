import { clearCart, getCart, getCartTotal, popCart, setCart } from "../cart.js";
import { getProductColors } from "../database.js";

// Initialize variables and fetch elements

const e_items = document.querySelector(".items");
const e_subtotal = document.querySelector("#subtotal");
const e_estimatedTax = document.querySelector("#estimatedTax");
const e_total = document.querySelector("#total");
const e_checkoutButton = document.querySelector("#checkoutButton");
const e_clearButton = document.querySelector("#clearButton");

async function loadCart() {
  const cart = getCart();

  if (!(cart.length > 0)) {
    e_items.innerHTML = "<p class='empty'>Your cart is empty! Let's get shopping!</p>";
    return;
  }

  e_items.innerHTML = "";
  for (const item of cart) {
    const productColor = (await getProductColors(item.id)).find(
      (productColor) => productColor.colorName === item.color,
    );

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
    e_info_title.href = `/product.html?id=${item.id}&color=${productColor.colorName}&size=${item.size}`;

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
      item.quantity++;
      setCart(cart);
      e_info_subtitle.textContent = getItemLabel();
      e_price.textContent = getItemPrice();
      updateTotal();
    });

    const e_info_actions_decrement = document.createElement("button");
    e_info_actions_decrement.className = "decrement";
    e_info_actions_decrement.innerHTML = "<i class='fa-solid fa-minus'></i>";
    e_info_actions_decrement.title = "Decrement";
    e_info_actions_decrement.addEventListener("click", () => {
      item.quantity--;
      if (item.quantity <= 0) {
        const confirmation = confirm("Are you sure you want to delete this item?");
        if (!confirmation) {
          item.quantity = 1;
          e_info_subtitle.textContent = getItemLabel();
        } else {
          popCart(item);
          e_item.remove();
        }
      } else {
        setCart(cart);
        e_info_subtitle.textContent = getItemLabel();
      }
      e_price.textContent = getItemPrice();
      updateTotal();
    });

    const e_info_actions_remove = document.createElement("button");
    e_info_actions_remove.className = "remove";
    e_info_actions_remove.innerHTML = "<i class='fa-solid fa-trash'></i>";
    e_info_actions_remove.title = "Delete";
    e_info_actions_remove.addEventListener("click", () => {
      const confirmation = confirm("Are you sure you want to delete this item?");
      if (!confirmation) return;
      popCart(item);
      e_item.remove();
      updateTotal();
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

async function updateTotal() {
  const cartTotal = await getCartTotal();
  const cartTax = cartTotal * 0.09;
  const cartSubtotal = cartTotal - cartTax;
  e_subtotal.textContent = `$${cartSubtotal.toFixed(2)}`;
  e_estimatedTax.textContent = `$${cartTax.toFixed(2)}`;
  e_total.textContent = `$${cartTotal.toFixed(2)}`;
}

function handleCheckout() {
  const cart = getCart();
  if (cart.length <= 0) {
    alert("Your cart is empty!");
    return;
  }
  location.href = "/checkout.html";
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
  loadCart();
}

e_checkoutButton.addEventListener("click", handleCheckout);
e_clearButton.addEventListener("click", handleClear);

loadCart();
updateTotal();
