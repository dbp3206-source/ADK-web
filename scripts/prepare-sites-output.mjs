import { cpSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const source = resolve("out");
const target = resolve("dist");

if (!existsSync(source)) {
  throw new Error(`Static export not found at ${source}`);
}

rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true });

console.log(`Prepared Sites static output at ${target}`);
