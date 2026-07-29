import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const source = resolve("out");
const target = resolve("dist");
const client = resolve(target, "client");
const server = resolve(target, "server");
const metadata = resolve(target, ".openai");
const hostingConfig = resolve(".openai", "hosting.json");

if (!existsSync(source)) {
  throw new Error(`Static export not found at ${source}`);
}

rmSync(target, { recursive: true, force: true });
mkdirSync(server, { recursive: true });
mkdirSync(metadata, { recursive: true });
cpSync(source, client, { recursive: true });
cpSync(hostingConfig, resolve(metadata, "hosting.json"));
writeFileSync(
  resolve(server, "index.js"),
  `const worker = {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};

export default worker;
`,
  "utf8"
);

console.log(`Prepared Sites worker output at ${target}`);
