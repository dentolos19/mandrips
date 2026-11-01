import { element } from "../utils.js";

const searchParams = new URLSearchParams(location.search || sessionStorage.getItem("receipt") || "");
const firstName = searchParams.get("firstName") ?? "Unknown";
const lastName = searchParams.get("lastName") ?? "Person";
const email = searchParams.get("email") ?? "Unknown";
const city = searchParams.get("city") ?? "Unknown";
const orderNumber = searchParams.get("orderNumber") ?? "Unknown";
const orderDate = searchParams.get("orderDate") ?? "Unknown";
const paymentType = searchParams.get("paymentType") ?? "Unknown";
const paymentTotal = searchParams.get("paymentTotal") ?? "Unknown";

const e_name = element("#name");
const e_continueButton = element("#continueButton");
const e_receiptButton = element("#receiptButton");
const e_backButton = element("#backButton");

const e_email = element("#customerEmail");
const e_city = element("#customerCity");
const e_orderDate = element("#orderDate");
const e_orderNumber = element("#orderNumber");
const e_paymentType = element("#paymentType");
const e_paymentTotal = element("#paymentTotal");

e_name.textContent = `${firstName} ${lastName}`;
e_email.textContent = email;
e_city.textContent = city;
e_orderDate.textContent = orderDate;
e_orderNumber.textContent = orderNumber;
e_paymentType.textContent = paymentType;
e_paymentTotal.textContent = paymentTotal;

e_continueButton.addEventListener("click", () => {
  location.href = "/products.html";
});

e_receiptButton.addEventListener("click", () => {
  print();
});

e_backButton.addEventListener("click", () => {
  location.href = "/";
});
