import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const output = "design-work/qa/screenshots";
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const captures = [
  { name: "home-desktop-1440.png", path: "/", width: 1440, height: 1000, fullPage: true },
  { name: "home-fold-1280x800.png", path: "/", width: 1280, height: 800, fullPage: false },
  { name: "system-desktop-1440.png", path: "/system/", width: 1440, height: 1000, fullPage: true },
  {
    name: "dashboard-desktop-1440.png",
    path: "/projects/dashboard-insights/",
    width: 1440,
    height: 1000,
    fullPage: true
  },
  { name: "home-mobile-375.png", path: "/", width: 375, height: 812, fullPage: true },
  { name: "system-mobile-320.png", path: "/system/", width: 320, height: 800, fullPage: true }
];

for (const capture of captures) {
  const page = await browser.newPage({ viewport: { width: capture.width, height: capture.height } });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(`http://127.0.0.1:4173${capture.path}`, { waitUntil: "networkidle" });
  if (capture.fullPage) {
    await page.addStyleTag({
      content: "* { content-visibility: visible !important; contain-intrinsic-size: none !important; }"
    });
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.75) {
        window.scrollTo(0, y);
        await new Promise((resolve) => window.setTimeout(resolve, 40));
      }
      window.scrollTo(0, 0);
    });
  }
  await page.screenshot({ path: `${output}/${capture.name}`, fullPage: capture.fullPage });
  if (errors.length > 0) {
    throw new Error(`${capture.path} emitted console errors: ${errors.join(" | ")}`);
  }
  await page.close();
}

await browser.close();
