import { type ColoredProduct, getProductsColors } from "../database.js";
import { element } from "../utils.js";

const e_products = element(".products");
const e_filters = element(".filters");
const e_toggleButton = element("#toggleButton");
const e_filterButton = element("#filterButton");
const e_closeButton = element("#closeButton");

const getFilterElement = (name: string, value: string) => {
  return element<HTMLInputElement>(`input[name='${name}'][value='${value}']`);
};

// Get filter elements
const e_typeShirt = getFilterElement("type", "shirt");
const e_typePolo = getFilterElement("type", "polo");
const e_typeHoodie = getFilterElement("type", "hoodie");
const e_typeSweater = getFilterElement("type", "sweater");
const e_typeHat = getFilterElement("type", "hat");
const e_typePants = getFilterElement("type", "pants");

const e_priceAll = getFilterElement("price", "all");
const e_priceLow = getFilterElement("price", "low");
const e_priceMid = getFilterElement("price", "mid");
const e_priceHigh = getFilterElement("price", "high");

function filterProduct(product: ColoredProduct) {
  // Get filter element states for types
  const f_typeShirt = e_typeShirt.checked;
  const f_typePolo = e_typePolo.checked;
  const f_typeHoodie = e_typeHoodie.checked;
  const f_typeSweater = e_typeSweater.checked;
  const f_typeHat = e_typeHat.checked;
  const f_typePants = e_typePants.checked;

  // Get filter element states for prices
  const f_priceAll = e_priceAll.checked;
  const f_priceLow = e_priceLow.checked;
  const f_priceMid = e_priceMid.checked;
  const f_priceHigh = e_priceHigh.checked;

  return !(
    ((f_typeShirt && product.type === e_typeShirt.value) ||
      (f_typePolo && product.type === e_typePolo.value) ||
      (f_typeHoodie && product.type === e_typeHoodie.value) ||
      (f_typeSweater && product.type === e_typeSweater.value) ||
      (f_typeHat && product.type === e_typeHat.value) ||
      (f_typePants && product.type === e_typePants.value)) &&
    (f_priceAll ||
      (f_priceLow && product.price < 10) ||
      (f_priceMid && product.price >= 10 && product.price < 30) ||
      (f_priceHigh && product.price >= 30))
  );
}

async function loadProducts() {
  const products = await getProductsColors();
  e_products.innerHTML = "";

  for (const product of products) {
    if (filterProduct(product)) {
      continue;
    }

    const e_image = document.createElement("img");
    e_image.src = product.colorUrl;
    e_image.alt = `${product.name} — ${product.colorName}`;

    const e_price = document.createElement("div");
    e_price.className = "price";
    e_price.textContent = `$${product.price.toFixed(2)}`;

    const e_container = document.createElement("a");
    e_container.className = "product";
    e_container.href = `/product.html?${new URLSearchParams({ id: String(product.id), color: product.colorName })}`;
    e_container.appendChild(e_image);
    e_container.appendChild(e_price);

    e_products.appendChild(e_container);
  }
}

function handleToggle() {
  e_filters.classList.toggle("hidden");
}

function handleFilter(event: Event) {
  event.preventDefault();
  loadProducts().catch(() => {
    e_products.textContent = "Could not load products. Please try again.";
  });
}

e_toggleButton.addEventListener("click", handleToggle);
e_filterButton.addEventListener("click", handleFilter);
e_closeButton.addEventListener("click", handleToggle);

loadProducts().catch(() => {
  e_products.textContent = "Could not load products. Please try again.";
});
