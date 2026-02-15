import { build as buildNavigation } from "./components/navigation.js";

document.querySelector("head").insertAdjacentHTML(
  "beforeend",
  `
<link rel="apple-touch-icon" sizes="180x180" href="/assets/metadata/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/metadata/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/metadata/favicon-16x16.png">
<link rel="manifest" href="/assets/metadata/site.webmanifest">
  `,
);

document.querySelector("nav").replaceWith(buildNavigation());

const disclaimerRead = JSON.parse(localStorage.getItem("disclaimerAccepted"));
if (!disclaimerRead) {
  document.querySelector("body").insertAdjacentHTML(
    "beforeend",
    `
<dialog class="disclaimer">
  <form method="dialog">
    <h1 class="title">Disclaimer</h1>
    <p>
      This is a non-commercial project and is not affiliated with Uniqlo.
      The images and products displayed on this website are for
      demonstration purposes only. All rights reserved by the respective
      owners.
    </p>
    <div class="actions">
      <button type="submit" autofocus>I understand</button>
    </div>
  </form>
</dialog>
    `,
  );
  document.querySelector(".disclaimer").showModal();
  document.querySelector(".disclaimer form").addEventListener("submit", () => {
    localStorage.setItem("disclaimerAccepted", "true");
  });
}
