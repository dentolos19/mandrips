class Product {
  /**
   *
   * @param {number} id
   * @param {string} type
   * @param {string} name
   * @param {number} price
   * @param {string} description
   * @param {ProductColor} colors
   */
  constructor(id, type, name, price, description, colors) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.price = price;
    this.description = description;
    this.colors = colors;
  }
}

class ProductColor {
  /**
   *
   * @param {string} name
   * @param {string} url
   */
  constructor(name, url) {
    this.name = name;
    this.url = url;
  }
}

class ColoredProduct {
  /**
   *
   * @param {number} id
   * @param {string} type
   * @param {string} name
   * @param {number} price
   * @param {string} description
   * @param {string} colorName
   * @param {string} colorUrl
   */
  constructor(id, type, name, price, description, colorName, colorUrl) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.price = price;
    this.description = description;
    this.colorName = colorName;
    this.colorUrl = colorUrl;
  }
}

/**
 *
 * @returns {Promise<Product[]>}
 */
export function getProducts() {
  return fetch("/database/products.json").then((response) => response.json());
}

/**
 *
 * @returns {Promise<ColoredProduct[]>}
 */
export function getProductsColors() {
  return getProducts().then((products) =>
    products.flatMap((product) =>
      product.colors.map((color) => {
        return {
          id: product.id,
          type: product.type,
          name: product.name,
          price: product.price,
          description: product.description,
          colorName: color.name,
          colorUrl: color.url,
        };
      }),
    ),
  );
}

/**
 *
 * @param {number} id
 * @returns {Promise<Product>}
 */
export function getProduct(id) {
  return getProducts().then((data) => data.find((product) => product.id.toString() === id));
}

/**
 *
 * @param {number} id
 * @returns {Promise<ColoredProduct[]>}
 */
export function getProductColors(id) {
  return getProduct(id).then((product) =>
    product.colors.map((color) => {
      return {
        id: product.id,
        type: product.type,
        name: product.name,
        price: product.price,
        description: product.description,
        colorName: color.name,
        colorUrl: color.url,
      };
    }),
  );
}
