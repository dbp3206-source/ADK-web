import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve("out");
const host = "127.0.0.1";
const port = Number(process.env.PORT || 4173);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2"
};

function resolveRequest(pathname) {
  const decoded = decodeURIComponent(pathname);
  const relative = normalize(decoded).replace(/^([/\\])+/, "");
  let candidate = resolve(join(root, relative));
  if (!candidate.startsWith(root)) return null;
  if (decoded.endsWith("/")) candidate = join(candidate, "index.html");
  if (existsSync(candidate) && statSync(candidate).isDirectory()) candidate = join(candidate, "index.html");
  return candidate;
}

createServer((request, response) => {
  if (!["GET", "HEAD"].includes(request.method ?? "GET")) {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  const pathname = new URL(request.url ?? "/", `http://${host}:${port}`).pathname;
  let file = resolveRequest(pathname);
  let status = 200;

  if (!file || !existsSync(file) || !statSync(file).isFile()) {
    file = join(root, "404.html");
    status = 404;
  }

  const extension = extname(file).toLowerCase();
  response.writeHead(status, {
    "Content-Type": contentTypes[extension] ?? "application/octet-stream",
    "Cache-Control": pathname.startsWith("/_next/") ? "public, max-age=31536000, immutable" : "no-cache",
    "X-Content-Type-Options": "nosniff"
  });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  createReadStream(file).pipe(response);
}).listen(port, host, () => {
  console.log(`Static portfolio available at http://${host}:${port}`);
});
