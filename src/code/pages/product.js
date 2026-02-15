import { pushCart } from "../cart.js";
import { getProductColors } from "../database.js";
import { getSearchParams, setSearchParams } from "../utils.js";

const sizes = [
  {
    id: "XS",
    name: "Extra Small",
  },
  {
    id: "S",
    name: "Small",
  },
  {
    id: "M",
    name: "Medium",
  },
  {
    id: "L",
    name: "Large",
  },
  {
    id: "XL",
    name: "Extra Large",
  },
  {
    id: "XXL",
    name: "Extra Extra Large",
  },
];

const searchParams = getSearchParams();
const id = searchParams.id;
const color = searchParams.color;
const size = searchParams.size;

const e_previews = document.querySelector(".preview");
const e_form = document.querySelector("form");
const e_name = document.querySelector(".name");
const e_price = document.querySelector(".price");
const e_description = document.querySelector(".description");
const e_colors = document.querySelector(".colors");
const e_sizes = document.querySelector(".sizes");

async function loadProducts() {
  const shirtColors = await getProductColors(id);

  // Load product description
  const shirtColor = shirtColors[0];
  e_name.textContent = shirtColor.name;
  e_price.textContent = `$${shirtColor.price.toFixed(2)}`;
  e_description.textContent = shirtColor.description;

  for (const shirtColor of shirtColors) {
    // Add shirt previews
    const e_preview = document.createElement("img");
    e_preview.src = shirtColor.colorUrl;
    e_preview.alt = shirtColor.colorName;
    e_previews.appendChild(e_preview);

    // Add color options
    const e_color = document.createElement("label");
    e_color.className = "option";

    const e_colorSelector = document.createElement("input");
    e_colorSelector.type = "radio";
    e_colorSelector.name = "color";
    e_colorSelector.value = shirtColor.colorName;
    e_colorSelector.addEventListener("change", () => {
      document.querySelector(`img[alt=${shirtColor.colorName}]`).scrollIntoView();
      setSearchParams({
        color: shirtColor.colorName,
      });
    });

    const e_colorName = document.createElement("span");
    e_colorName.textContent = shirtColor.colorName;

    // TODO: check default if color is invalid
    if (!color) {
      e_colorSelector.checked = shirtColor.colorName === shirtColors[0].colorName;
    } else if (shirtColor.colorName === color) {
      e_colorSelector.checked = true;
    }

    e_color.appendChild(e_colorSelector);
    e_color.appendChild(e_colorName);
    e_colors.appendChild(e_color);
  }

  // Scroll to param color
  document.querySelector(`img[alt=${color}]`).scrollIntoView();

  // Add size options
  for (const shirtSize of sizes) {
    const sizeElement = document.createElement("label");
    sizeElement.className = "option";

    const sizeSelectorElement = document.createElement("input");
    sizeSelectorElement.type = "radio";
    sizeSelectorElement.name = "size";
    sizeSelectorElement.value = shirtSize.name;
    sizeSelectorElement.addEventListener("change", () => {
      setSearchParams({
        size: shirtSize.id,
      });
    });

    const sizeNameElement = document.createElement("span");
    sizeNameElement.textContent = shirtSize.id;
    sizeNameElement.title = shirtSize.name;

    // TODO: check default if size is invalid
    if (!size) {
      sizeSelectorElement.checked = shirtSize.id === sizes[2].id;
    } else if (shirtSize.id === size || shirtSize.name === size) {
      sizeSelectorElement.checked = true;
    }

    sizeElement.appendChild(sizeSelectorElement);
    sizeElement.appendChild(sizeNameElement);
    e_sizes.appendChild(sizeElement);
  }
}

function handleAdd(event) {
  event.preventDefault();

  const data = new FormData(event.target);
  const entries = Object.fromEntries(data.entries());

  pushCart({
    id,
    color: entries.color,
    size: entries.size,
    quantity: entries.quantity,
  });

  alert("Added to cart!");
}

e_form.addEventListener("submit", handleAdd);

loadProducts();
