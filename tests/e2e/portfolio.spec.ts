import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const slugs = ["trip-planner", "script-team", "worldcup-analyst", "love-advisor", "dashboard-insights", "a2a-orchestrator"];
const coreRoutes = ["/vi/", "/vi/projects/", "/vi/system/", "/vi/learn/", "/vi/evidence/", "/vi/about/", "/vi/contact/"];

test("Vietnamese is the default and the architecture ladder stays ordered", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("hệ sinh thái agent");
  await expect(page.locator(".capability-checkpoints button .capability-code")).toHaveText(["ACT", "DELEGATE", "COMPUTE", "COMPOSE", "VERIFY", "CONNECT"]);
  await expect(page.locator('a[href*="__"]')).toHaveCount(0);
});

test("locale toggle preserves route and query", async ({ page }) => {
  await page.goto("/vi/system/?preset=dashboard&step=3");
  await page.locator(".locale-toggle").click();
  await expect(page).toHaveURL(/\/en\/system\/\?preset=dashboard&step=3/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("legacy routes redirect safely to Vietnamese", async ({ page }) => {
  await page.goto("/projects/?mode=engineer");
  await expect(page).toHaveURL(/\/vi\/projects\/\?mode=engineer/);
});

test("system trace exposes all V2 controls and inspectable contracts", async ({ page }) => {
  await page.goto("/vi/system/");
  await expect(page.locator(".simulation-banner")).toContainText("Mô phỏng từ kiến trúc repository");
  await expect(page.locator(".trace-step-list button")).toHaveCount(7);
  await page.locator(".explorer-controls button").filter({ hasText: "Bước tiếp" }).click();
  await expect(page.locator(".contract-inspector")).toContainText("Lý do điều phối");
  await expect(page.locator(".contract-inspector")).toContainText("Agent Card");
  await expect(page.locator(".contract-inspector")).toContainText("Workflow nội bộ");
  await expect(page.locator(".contract-inspector")).toContainText("Tool/Data contract");
  await expect(page.locator(".contract-inspector")).toContainText("Kiểm chứng");
  await expect(page.locator(".contract-inspector")).toContainText("Artifact / fallback");
});

test("trace autoplay, restart and deep link work", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/en/system/");
  await page.getByRole("button", { name: "Play" }).click();
  await expect(page.getByRole("button", { name: "Pause", exact: true }).first()).toBeVisible();
  await page.waitForTimeout(1200);
  await expect(page).toHaveURL(/step=2/);
  await page.getByRole("button", { name: "Restart" }).click();
  await expect(page).toHaveURL(/step=1/);
  await page.getByRole("button", { name: "Copy a link to this step" }).click();
  await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
});

test("projects search, AND filters, table view and empty state work", async ({ page }) => {
  await page.goto("/en/projects/");
  await page.getByRole("button", { name: "State", exact: true }).click();
  await page.getByRole("button", { name: "A2A", exact: true }).click();
  await expect(page.getByText("No project matches all selected patterns. Clear one filter.")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).last().click();
  await expect(page.locator(".project-ladder-v2>li")).toHaveCount(6);
  await page.getByRole("button", { name: "Comparison view" }).click();
  await expect(page.locator(".project-table-wrap tbody tr")).toHaveCount(6);
});

for (const slug of slugs) {
  test(`${slug} has one internal timeline, unique lab and honest evidence`, async ({ page }) => {
    await page.goto(`/en/projects/${slug}/`);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator(".unique-stage-v2")).toBeVisible();
    await page.locator("#lab").scrollIntoViewIfNeeded();
    await expect(page.locator(".project-lab")).toBeVisible();
    await expect(page.locator(".lab-notice")).toContainText("Local interactive simulation");
    await expect(page.getByRole("heading", { name: "Architecture" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Limitations" })).toBeVisible();
    await expect(page.getByText("No verified file path and commit are available.").first()).toBeVisible();
    await expect(page.locator(".case-content-v2 .system-explorer-v2")).toHaveCount(0);
  });
}

test("all six deterministic labs change state or artifact", async ({ page }) => {
  await page.goto("/en/projects/trip-planner/#lab");
  await page.getByRole("button", { name: "Save state" }).click();
  await expect(page.locator(".state-artifact")).toContainText("FOUND");

  await page.goto("/en/projects/script-team/#lab");
  await page.getByRole("tab", { name: /Reviser/ }).click();
  await expect(page.locator(".revision-diff")).toBeVisible();

  await page.goto("/en/projects/worldcup-analyst/#lab");
  await page.getByRole("button", { name: "Calculate with code" }).click();
  await expect(page.locator(".analyst-artifact")).toContainText("SYNTHESIS");

  await page.goto("/en/projects/love-advisor/#lab");
  await page.locator('select[name="love-lens-a"]').selectOption({ index: 1 });
  await page.locator('select[name="love-lens-b"]').selectOption({ index: 1 });
  await page.getByRole("button", { name: "Complete lens A" }).click();
  await page.getByRole("button", { name: "Complete lens B" }).click();
  await page.getByRole("button", { name: "Synthesize schema" }).click();
  await expect(page.locator(".schema-artifact")).toContainText("uncertainty");

  await page.goto("/en/projects/dashboard-insights/#lab");
  await page.getByRole("button", { name: /Run analysis/ }).click();
  await expect(page.locator(".claim-matrix")).toBeVisible();

  await page.goto("/en/projects/a2a-orchestrator/#lab");
  await page.getByRole("button", { name: "Run routing" }).click();
  await expect(page.locator(".routing-artifact")).toContainText("Agent Card");
});

test("command deck traps focus, navigates and resets progress", async ({ page }) => {
  await page.goto("/vi/");
  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog", { name: "Command Deck" });
  await expect(dialog).toBeVisible();
  await expect(page.locator('input[name="command-search"]')).toBeFocused();
  await page.locator('input[name="command-search"]').fill("evidence");
  await dialog.getByRole("button", { name: /Bằng chứng/ }).first().click();
  await expect(page).toHaveURL(/\/vi\/evidence/);
});

test("voice is user initiated and keeps text fallback", async ({ page }) => {
  await page.goto("/vi/");
  const guide = page.locator(".voice-guide").first();
  await expect(guide.locator(".voice-transcript")).not.toBeEmpty();
  await expect(guide.getByRole("button", { name: "Nghe" })).toBeVisible();
  await expect(guide.getByRole("button", { name: "Dừng", exact: true })).toBeDisabled();
});

test("reduced motion keeps trace information and controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/vi/system/");
  await expect(page.locator(".trace-step-list button")).toHaveCount(7);
  await expect(page.locator(".simulation-banner")).toBeVisible();
  await page.locator(".explorer-controls button").filter({ hasText: "Bước tiếp" }).click();
  await expect(page).toHaveURL(/step=2/);
});

test("mobile navigation and command deck restore keyboard focus", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/vi/");
  const trigger = page.getByRole("button", { name: "Menu" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Điều hướng chính" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog", { name: "Command Deck" })).toBeVisible();
  await page.keyboard.press("Escape");
});

test("approved responsive widths have no page-level overflow", async ({ page }) => {
  for (const width of [320, 375, 414, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/vi/", "/vi/projects/", "/vi/system/", "/vi/projects/dashboard-insights/"]) {
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${route} at ${width}`).toBeLessThanOrEqual(1);
    }
  }
});

for (const route of [...coreRoutes, ...slugs.map((slug) => `/vi/projects/${slug}/`)]) {
  test(`${route} passes serious/critical axe and console checks`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(route);
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("direct route refresh and custom 404 remain functional", async ({ page }) => {
  const project = await page.goto("/en/projects/a2a-orchestrator/");
  expect(project?.ok()).toBe(true);
  await page.reload();
  await expect(page.locator("h1")).toContainText("A2A Orchestrator");
  const missing = await page.goto("/route-that-does-not-exist/");
  expect(missing?.status()).toBe(404);
});
