import { pushCart } from "../cart.js";
import { getProductColors } from "../database.js";
import { element, setSearchParams } from "../utils.js";

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

const searchParams = new URLSearchParams(location.search);
const id = searchParams.get("id");
const color = searchParams.get("color");
const size = searchParams.get("size");

const e_previews = element(".preview");
const e_form = element<HTMLFormElement>("form");
const e_name = element(".name");
const e_price = element(".price");
const e_description = element(".description");
const e_colors = element(".colors");
const e_sizes = element(".sizes");

async function loadProducts() {
  const shirtColors = await getProductColors(id);

  const shirtColor = shirtColors[0];
  if (!shirtColor) throw new Error("Product not found.");
  const selectedColor = shirtColors.some((entry) => entry.colorName === color) ? color : shirtColor.colorName;
  const selectedSize = sizes.find((entry) => entry.id === size || entry.name === size)?.id ?? "M";
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
      e_preview.scrollIntoView({ block: "nearest", inline: "nearest" });
      setSearchParams({
        color: shirtColor.colorName,
      });
    });

    const e_colorName = document.createElement("span");
    e_colorName.textContent = shirtColor.colorName;

    e_colorSelector.checked = shirtColor.colorName === selectedColor;
    if (e_colorSelector.checked && color) e_preview.scrollIntoView({ block: "nearest", inline: "nearest" });

    e_color.appendChild(e_colorSelector);
    e_color.appendChild(e_colorName);
    e_colors.appendChild(e_color);
  }

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

    sizeSelectorElement.checked = shirtSize.id === selectedSize;

    sizeElement.appendChild(sizeSelectorElement);
    sizeElement.appendChild(sizeNameElement);
    e_sizes.appendChild(sizeElement);
  }
}

function handleAdd(event: SubmitEvent) {
  event.preventDefault();

  const data = new FormData(e_form);
  const entries = Object.fromEntries(data.entries());

  try {
    pushCart({
      id: Number(id),
      color: String(entries.color ?? ""),
      size: String(entries.size ?? ""),
      quantity: Number(entries.quantity),
    });

    alert("Added to cart!");
  } catch (error) {
    alert(error instanceof Error ? error.message : "Could not update cart.");
  }
}

e_form.addEventListener("submit", handleAdd);

const addButton = element<HTMLButtonElement>("button[type=submit]");
addButton.disabled = true;
loadProducts()
  .then(() => {
    addButton.disabled = false;
  })
  .catch((error: unknown) => {
    e_name.textContent = error instanceof Error ? error.message : "Could not load product.";
  });
