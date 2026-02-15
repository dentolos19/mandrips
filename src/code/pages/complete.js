import { getSearchParams } from "../utils.js";

const searchParams = getSearchParams();
const firstName = searchParams.firstName ?? "Unknown";
const lastName = searchParams.lastName ?? "Person";
const email = searchParams.email ?? "Unknown";
const city = searchParams.city ?? "Unknown";
const orderNumber = searchParams.orderNumber ?? "Unknown";
const orderDate = searchParams.orderDate ?? "Unknown";
const paymentType = searchParams.paymentType ?? "Unknown";
const paymentTotal = searchParams.paymentTotal ?? "Unknown";

const e_name = document.querySelector("#name");
const e_continueButton = document.querySelector("#continueButton");
const e_receiptButton = document.querySelector("#receiptButton");
const e_backButton = document.querySelector("#backButton");

const e_email = document.querySelector("#customerEmail");
const e_city = document.querySelector("#customerCity");
const e_orderDate = document.querySelector("#orderDate");
const e_orderNumber = document.querySelector("#orderNumber");
const e_paymentType = document.querySelector("#paymentType");
const e_paymentTotal = document.querySelector("#paymentTotal");

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
