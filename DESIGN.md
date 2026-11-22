# Design System

## Framework

- Pages are static HTML in [`src/`](src/) with no UI framework or component library.
- Behavior comes from TypeScript modules in [`src/code/`](src/code/). [`main.ts`](src/code/main.ts) loads on every page, injects the navigation, and shows the disclaimer dialog.
- Icons come from Font Awesome, loaded from a CDN.

## Styling

- Styles are plain CSS. Every page loads [`common.css`](src/code/common.css), which imports the theme and shared components, plus its own stylesheet in [`src/code/pages/`](src/code/pages/).

## Tokens

Tokens are defined in [`theme.css`](src/code/theme.css):

- **Primary colors**: `--primary-100` (`#00b4d8`), `--primary-200` (`#0077b6`), and `--primary-300` (`#03045e`).
- **Neutral colors**: `--neutral-100`, `--neutral-200`, and `--neutral-300`, light grays from `rgb(250, 250, 250)` to `rgb(240, 240, 240)`.
- **Border**: `--border`, a 1px semi-transparent gray line.
- **Radius**: `--component-radius` (4px) for controls and `--container-radius` (8px) for containers.
- **Shadows**: `--low-shadow` and `--high-shadow`.
- **Font**: Inter from Google Fonts, falling back to sans-serif.

## Layout

- The body is a full-height grid with the navigation bar on top and a scrollable `main` that fades in on load.
- The navigation links to Home, Products, and Cart, and marks the current page's link as active.

## Components

- Shared component styles live in [`src/code/components/`](src/code/components/): buttons, dialogs, inputs, and navigation.
- Buttons use the neutral background, border, component radius, and low shadow. The `primary` modifier uses the primary color, and `circle` makes a round icon button.
