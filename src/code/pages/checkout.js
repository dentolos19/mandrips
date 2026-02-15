import { clearCart, getCartTotal } from "../cart.js";

const e_form = document.querySelector("form");

async function handleOrder(event) {
  event.preventDefault();

  const cartTotal = await getCartTotal();

  const data = new FormData(event.target);
  const entries = Object.fromEntries(data.entries());

  let href = "/complete.html?";

  const firstName = entries.firstName;
  const lastName = entries.lastName;
  const email = entries.email;
  const city = entries.cityName;
  const orderNumber = Math.floor(Math.random() * 10 ** 6);
  const orderDate = new Date().toLocaleDateString("en-SG");
  const paymentType = "Credit Card";
  const paymentTotal = `$${cartTotal.toFixed(2)}`;

  href += `firstName=${firstName}`;
  href += `&lastName=${lastName}`;
  href += `&email=${email}`;
  href += `&city=${city}`;
  href += `&orderNumber=${orderNumber}`;
  href += `&orderDate=${orderDate}`;
  href += `&paymentType=${paymentType}`;
  href += `&paymentTotal=${paymentTotal}`;

  clearCart();

  location.href = href;
  // /complete.html?firstName=Dennise&lastName=Catolos&email=dentolos19@gmail.com&city=Singapore&orderDate=21/21/21&orderNumber=123456&paymentType=Credit%20Card&paymentTotal=S$100
}

function handleCancel(event) {
  event.preventDefault();

  location.href = "/cart.html";
}

e_form.addEventListener("submit", handleOrder);
e_form.addEventListener("reset", handleCancel);
