import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const output = "design-work/qa/v2.2/baseline/screenshots";
await mkdir(output, { recursive: true });

const browser = await chromium.launch();
const findings = [];

for (const width of [320, 375, 414, 768, 1024, 1440]) {
  const context = await browser.newContext({
    viewport: { width, height: width < 600 ? 900 : 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("http://127.0.0.1:4173/vi/", {
    waitUntil: "networkidle",
  });
  await page.screenshot({
    path: `${output}/home-${width}.png`,
    fullPage: true,
  });

  findings.push({
    width,
    route: "/vi/",
    consoleErrors,
    pageErrors,
    scrollWidth: await page.evaluate(() => document.documentElement.scrollWidth),
    clientWidth: await page.evaluate(() => document.documentElement.clientWidth),
  });

  await context.close();
}

await browser.close();
await writeFile(
  "design-work/qa/v2.2/baseline/browser-findings.json",
  `${JSON.stringify(findings, null, 2)}\n`,
  "utf8",
);
