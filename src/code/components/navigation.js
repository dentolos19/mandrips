const links = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Products",
    href: "/products.html",
  },
  {
    title: "Cart",
    href: "/cart.html",
  },
];

export function build() {
  const e_nav = document.createElement("nav");

  const e_title = document.createElement("div");
  e_title.className = "title";
  e_title.innerHTML = "<a href='/'>Mandrips</a>";

  const e_links = document.createElement("div");
  e_links.className = "links";

  for (const link of links) {
    const e_link = document.createElement("a");
    e_link.href = link.href;
    e_link.textContent = link.title;
    e_links.appendChild(e_link);
  }

  const e_toggle = document.createElement("div");
  e_toggle.className = "toggle";
  e_toggle.innerHTML = "<i class='fa fa-bars'></i>";

  e_toggle.addEventListener("click", () => {
    e_links.classList.toggle("active");
  });

  e_nav.appendChild(e_title);
  e_nav.appendChild(e_toggle);
  e_nav.appendChild(e_links);

  return e_nav;
}

document.addEventListener("DOMContentLoaded", () => {
  const linkElements = document.querySelectorAll("nav .links a");
  for (const link of linkElements) {
    if (link.href === window.location.href) {
      link.classList.add("active");
      link.href = "#";
    }
  }
});
