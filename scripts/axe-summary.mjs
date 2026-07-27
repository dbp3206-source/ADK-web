import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
for (const route of ["/vi/", "/vi/projects/", "/vi/system/", "/vi/projects/trip-planner/", "/vi/projects/a2a-orchestrator/"]) {
  await page.goto(`http://127.0.0.1:4173${route}`);
  const result = await new AxeBuilder({ page }).analyze();
  const serious = result.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""));
  console.log(JSON.stringify({ route, violations: serious.map((item) => ({ id: item.id, nodes: item.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })) })) }, null, 2));
}
await browser.close();
