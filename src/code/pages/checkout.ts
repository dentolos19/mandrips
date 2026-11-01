import { clearCart, getCartTotal } from "../cart.js";
import { element } from "../utils.js";

const form = element<HTMLFormElement>("form");
const submit = element<HTMLButtonElement>("button[type=submit]");

async function handleOrder(event: SubmitEvent) {
  event.preventDefault();
  submit.disabled = true;
  try {
    const total = await getCartTotal();
    if (total <= 0) throw new Error("Your cart is empty!");
    const data = new FormData(form);
    const params = new URLSearchParams({
      firstName: String(data.get("firstName") ?? ""),
      lastName: String(data.get("lastName") ?? ""),
      email: String(data.get("email") ?? ""),
      city: String(data.get("cityName") ?? ""),
      orderNumber: String(Math.floor(Math.random() * 10 ** 6)),
      orderDate: new Date().toLocaleDateString("en-SG"),
      paymentType: "Credit Card",
      paymentTotal: `$${total.toFixed(2)}`,
    });
    sessionStorage.setItem("receipt", params.toString());
    clearCart();
    location.href = "/complete.html";
  } catch (error) {
    alert(error instanceof Error ? error.message : "Could not complete order.");
    submit.disabled = false;
  }
}

form.addEventListener("submit", handleOrder);
form.addEventListener("reset", (event) => {
  event.preventDefault();
  location.href = "/cart.html";
});
