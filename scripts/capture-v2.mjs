import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const output = "design-work/qa/v2/screenshots";
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
async function revealLazySections(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((resolve) => window.setTimeout(resolve, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);
}
for (const width of [320, 375, 414, 768, 1024, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: width < 600 ? 900 : 1000 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/vi/", { waitUntil: "networkidle" });
  await revealLazySections(page);
  await page.screenshot({ path: `${output}/home-${width}.png`, fullPage: true });
  if ([375, 1440].includes(width)) {
    for (const [name, route] of [["system", "/vi/system/"], ["dashboard", "/vi/projects/dashboard-insights/"], ["a2a", "/vi/projects/a2a-orchestrator/"]]) {
      await page.goto(`http://127.0.0.1:4173${route}`, { waitUntil: "networkidle" });
      await revealLazySections(page);
      await page.screenshot({ path: `${output}/${name}-${width}.png`, fullPage: true });
    }
  }
  await context.close();
}
await browser.close();
