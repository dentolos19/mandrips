# Product Specifications

## Purpose

Mandrips is a demonstration online clothing store with the tagline "It fits. It drips." It was built as an assignment for the Web Development module at Nanyang Polytechnic. It is non-commercial and not affiliated with Uniqlo; its product images and names are for demonstration only.

## Users

- **Shoppers**: Visitors who browse the catalog, add items to a cart, and complete a mock checkout.

## Core Features

- **Home**: A landing page with a background video, the logo, and the tagline.
- **Disclaimer**: A dialog on first visit explaining that the site is a non-commercial demonstration, remembered once accepted.
- **Catalog**: Lists products from [`src/database/products.json`](src/database/products.json), with filters by type (shirts, polos, hoodies, sweaters, hats, and pants) and by price range.
- **Product page**: Shows a product with selectable colors and sizes.
- **Size guide**: A product size guide page.
- **Cart**: Stores items in the browser's local storage and shows the total.
- **Checkout**: A form for name, email, address, and card details that clears the cart and generates an order number.
- **Order completion**: A receipt page showing the customer, order number, date, payment type, and total.

## Scope

- Pages live in [`src/`](src/) and their scripts in [`src/code/`](src/code/).

### Out of Scope

- There is no backend, database, or user account; all state stays in the browser.
- Checkout does not process payments or submit card details anywhere.
