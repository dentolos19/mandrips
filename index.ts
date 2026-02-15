const PORT = 3000;
const PATH = "src";

Bun.serve({
  port: PORT,
  async fetch(req) {
    const date = new Date();
    const url = new URL(req.url);
    const name = url.pathname === "/" ? "/index.html" : url.pathname;
    const file = Bun.file(PATH + name);

    console.log(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] ${req.method} ${url.pathname}`);
    return (await file.exists()) ? new Response(file) : new Response("Page not found.", { status: 404 });
  },
  error() {
    const date = new Date();

    console.error(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] An error occurred.`);
    return new Response("An error occurred.", { status: 500 });
  },
});

console.log(`Server is running at http://localhost:${PORT}`);
