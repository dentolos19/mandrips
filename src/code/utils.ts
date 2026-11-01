export function element<E extends HTMLElement = HTMLElement>(selector: string): E {
  const node = document.querySelector<E>(selector);
  if (!node) throw new Error(`Missing page element: ${selector}`);
  return node;
}

export function setSearchParams(params: Record<string, string>) {
  const url = new URL(location.href);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  window.history.replaceState(null, "", url.toString());
}
