import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const caseStudySlugs = [
  "trip-planner",
  "script-team",
  "worldcup-analyst",
  "love-advisor",
  "dashboard-insights",
  "a2a-orchestrator"
];

test("home presents the ordered six-step ladder and no placeholder links", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("distributed agent ecosystem");
  const verbs = await page.locator(".capability-ladder .capability-verb").allTextContents();
  expect(verbs).toEqual(["ACT", "DELEGATE", "COMPUTE", "COMPOSE", "VERIFY", "CONNECT"]);
  await expect(page.locator('a[href*="__"]')).toHaveCount(0);
  await expect(page.getByText("Simulated trace from repository architecture").first()).toBeVisible();
});

test("trace controls update the step inspector and remain keyboard operable", async ({ page }) => {
  await page.goto("/system/");
  const next = page.getByRole("button", { name: "Next" });
  await next.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Intent recognized" })).toBeVisible();
  await page.getByRole("button", { name: "Restart" }).click();
  await expect(page.getByRole("heading", { name: "User prompt" })).toBeVisible();
  await page.getByRole("button", { name: "Play" }).click();
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
});

test("project filters announce results and expose the approved empty state", async ({ page }) => {
  await page.goto("/projects/");
  await page.getByLabel("State").check();
  await page.getByLabel("A2A").check();
  await expect(page.getByText("No project matches all selected patterns. Clear one filter.")).toBeVisible();
  await page.getByRole("status").getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".project-index-row")).toHaveCount(6);
});

for (const slug of caseStudySlugs) {
  test(`${slug} includes every required case-study section`, async ({ page }) => {
    await page.goto(`/projects/${slug}/`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "The user job" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Architecture" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Request trace" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Verified code only." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Design decisions" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Failure modes" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "The next engineering layer" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Proof remains pending/ })).toBeVisible();
    await expect(page.getByText("Simulated trace from repository architecture")).toBeVisible();
  });
}

test("Love Advisor keeps safety and uncertainty visible", async ({ page }) => {
  await page.goto("/projects/love-advisor/");
  await expect(page.getByText("Safety and uncertainty.")).toBeVisible();
  const body = await page.locator("body").innerText();
  expect(body.toLowerCase()).not.toContain("appearance score");
  expect(body.toLowerCase()).not.toContain("production-ready");
});

test("mobile navigation traps focus, closes with Escape and restores trigger focus", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Menu" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Site navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Site navigation" })).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("all key routes avoid page-level overflow across approved widths", async ({ page }) => {
  const routes = ["/", "/projects/", "/system/", "/learn/", "/evidence/", "/projects/dashboard-insights/"];
  const widths = [320, 375, 414, 768, 1024, 1440];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${route} overflows at ${width}px`).toBeLessThanOrEqual(1);
    }
  }
});

const accessibilityRoutes = [
  "/",
  "/projects/",
  "/system/",
  "/learn/",
  "/learn/agent-vs-chatbot/",
  "/learn/file-anatomy/",
  "/learn/multi-agent-patterns/",
  "/learn/mcp-vs-a2a/",
  "/evidence/",
  "/about/",
  "/contact/",
  ...caseStudySlugs.map((slug) => `/projects/${slug}/`)
];

for (const route of accessibilityRoutes) {
  test(`${route} has no serious axe violations or uncaught console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("direct routes, heading structure, diagram alternatives and glossary focus remain intact", async ({ page }) => {
  const routes = ["/", "/projects/", "/system/", "/learn/", "/evidence/", "/about/", "/contact/"];
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("h1")).toHaveCount(1);
  }

  await page.goto("/projects/dashboard-insights/");
  await expect(page.locator("figure:has(svg[role='img'])")).toHaveCount(1);
  await expect(page.getByText("Read the diagram as text")).toBeVisible();

  await page.goto("/learn/");
  const glossaryTerm = page.locator(".glossary-entry dt").first();
  await glossaryTerm.focus();
  await expect(glossaryTerm.getByRole("tooltip")).toBeVisible();

  const response = await page.goto("/projects/a2a-orchestrator/");
  expect(response?.ok()).toBe(true);
});

test("the custom 404 keeps recovery links available", async ({ page }) => {
  const response = await page.goto("/route-that-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("outside the current system map");
  await expect(page.getByRole("navigation", { name: "404 recovery links" }).getByRole("link", { name: "Projects" })).toBeVisible();
});

test("mobile system explorer remains complete in reduced-motion mode", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/system/");
  await expect(page.getByText("Simulated trace from repository architecture")).toBeVisible();
  await expect(page.getByRole("button", { name: "Play" })).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByRole("heading", { name: "Intent recognized" })).toBeVisible();
});
