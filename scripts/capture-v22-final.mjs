import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const output = "design-work/qa/v2.2/final/screenshots";
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const findings = [];
const widths = [320, 375, 414, 768, 1024, 1440];

async function primeFullPage(page) {
  await page.addStyleTag({
    content: `
      .recruiter-snapshot,.featured-lab,.editorial-rows-v2,.agent-core-home,
      .pattern-comparator,.evidence-bridge-v2,.contact-terminal-v2,.site-footer-v2,
      .featured-a2a-v2 { content-visibility: visible !important; contain-intrinsic-size: none !important; }
    `,
  });
  await page.evaluate(async () => {
    const height = document.documentElement.scrollHeight;
    for (let y = 0; y < height; y += 700) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);
}

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: width < 600 ? 900 : 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("http://127.0.0.1:4173/vi/", { waitUntil: "networkidle" });
  await primeFullPage(page);
  await page.screenshot({ path: `${output}/home-${width}.png`, fullPage: true });
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

for (const [name, route] of [
  ["trip-replay", "/vi/projects/trip-planner/?case=TP-01&event=2#replay"],
  ["learning", "/vi/learn/"],
  ["flashcards", "/vi/learn/flashcards/"],
  ["system", "/vi/system/?preset=dashboard-drop&step=4"],
]) {
  for (const width of [375, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width === 375 ? 900 : 1000 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(`http://127.0.0.1:4173${route}`, { waitUntil: "networkidle" });
    await primeFullPage(page);
    await page.screenshot({ path: `${output}/${name}-${width}.png`, fullPage: true });
    findings.push({
      width,
      route,
      consoleErrors,
      pageErrors,
      scrollWidth: await page.evaluate(() => document.documentElement.scrollWidth),
      clientWidth: await page.evaluate(() => document.documentElement.clientWidth),
    });
    await context.close();
  }
}

await browser.close();
await mkdir("design-work/qa/v2.2/final", { recursive: true });
await writeFile("design-work/qa/v2.2/final/browser-findings.json", `${JSON.stringify(findings, null, 2)}\n`, "utf8");
