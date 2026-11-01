export type ProductColor = { name: string; url: string };
export type Product = {
  id: number;
  type: string;
  name: string;
  price: number;
  description: string;
  colors: ProductColor[];
};
export type ColoredProduct = Omit<Product, "colors"> & { colorName: string; colorUrl: string };

let products: Promise<Product[]> | undefined;

function isProduct(value: unknown): value is Product {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number" &&
    Number.isSafeInteger(value.id) &&
    "type" in value &&
    typeof value.type === "string" &&
    "name" in value &&
    typeof value.name === "string" &&
    "price" in value &&
    typeof value.price === "number" &&
    Number.isFinite(value.price) &&
    value.price >= 0 &&
    "description" in value &&
    typeof value.description === "string" &&
    "colors" in value &&
    Array.isArray(value.colors) &&
    value.colors.length > 0 &&
    value.colors.every(
      (color: unknown) =>
        typeof color === "object" &&
        color !== null &&
        "name" in color &&
        typeof color.name === "string" &&
        "url" in color &&
        typeof color.url === "string",
    )
  );
}

export function getProducts(): Promise<Product[]> {
  products ??= fetch("/database/products.json")
    .then(async (response) => {
      if (!response.ok) throw new Error("Could not load products. Please try again.");
      const data: unknown = await response.json();
      if (!Array.isArray(data) || !data.every(isProduct)) throw new Error("Invalid product catalog.");
      return data;
    })
    .catch((error: unknown) => {
      products = undefined;
      throw error;
    });
  return products;
}

export async function getProductsColors(): Promise<ColoredProduct[]> {
  return (await getProducts()).flatMap(({ colors, ...product }) =>
    colors.map((color) => ({ ...product, colorName: color.name, colorUrl: color.url })),
  );
}

export async function getProductColors(id: string | number | null): Promise<ColoredProduct[]> {
  return (await getProductsColors()).filter((product) => String(product.id) === String(id));
}
