/**
 * @typedef {object} ProductColor
 * @property {string} name
 * @property {string} url
 */

/**
 * @typedef {object} Product
 * @property {number} id
 * @property {string} type
 * @property {string} name
 * @property {number} price
 * @property {string} description
 * @property {ProductColor[]} colors
 */

/**
 * @typedef {object} ColoredProduct
 * @property {number} id
 * @property {string} type
 * @property {string} name
 * @property {number} price
 * @property {string} description
 * @property {string} colorName
 * @property {string} colorUrl
 */

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
