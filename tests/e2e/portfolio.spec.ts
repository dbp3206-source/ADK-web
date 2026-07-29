import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const slugs = ["trip-planner", "script-team", "worldcup-analyst", "love-advisor", "dashboard-insights", "a2a-orchestrator"];
const coreRoutes = [
  "/vi/",
  "/vi/projects/",
  "/vi/system/",
  "/vi/learn/",
  "/vi/learn/ai-practical/",
  "/vi/learn/projects/",
  "/vi/learn/system-concepts/",
  "/vi/contact/"
];

test("V3.5 home leads with three concrete artifacts and the ordered field guide", async ({ page }) => {
  await page.goto("/vi/");
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.locator(".hero-artifact")).toHaveCount(3);
  await expect(page.locator(".hero-field-guide-mark")).toHaveCount(0);
  await expect(page.locator(".capability-checkpoints button .capability-code")).toHaveText([
    "ACT", "DELEGATE", "COMPUTE", "COMPOSE", "VERIFY", "CONNECT"
  ]);
  await expect(page.locator(".footer-build p:last-child")).toContainText("v3.5.0");
});

test("locale toggle preserves the current route and query", async ({ page }) => {
  await page.goto("/vi/system/?preset=dashboard&step=3");
  await page.locator(".locale-toggle").click();
  await expect(page).toHaveURL(/\/en\/system\/\?preset=dashboard&step=3/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("projects start from human needs and keep technical filters advanced", async ({ page }) => {
  await page.goto("/vi/projects/");
  await expect(page.locator(".problem-starters button")).toHaveCount(7);
  await page.getByRole("button", { name: "Kiểm tra dữ liệu" }).click();
  await expect(page.locator(".project-problem-ledger>li")).toHaveCount(1);
  await expect(page.locator(".project-problem-ledger strong")).toContainText("Dashboard Insights");
  await page.locator(".advanced-project-filters summary").click();
  await expect(page.locator(".advanced-project-filters fieldset")).toBeVisible();
  await expect(page.locator(".project-problem-ledger dt").first()).toHaveText("Tình huống");
  await expect(page.locator(".project-problem-ledger dt").nth(4)).toHaveText("Năng lực mới");
});

test("case study follows the public V3.5 hierarchy", async ({ page }) => {
  await page.goto("/vi/projects/dashboard-insights/");
  await expect(page.locator(".case-body-v3 h2")).toHaveText([
    "Tình huống thực tế",
    "Tại sao cách đơn giản chưa đủ?",
    "Cách project xử lý",
    "Xem agent làm việc",
    "Kết quả và giá trị"
  ]);
  await expect(page.locator(".case-decision-ledger article").first().locator("dt")).toHaveText([
    "Vấn đề", "Quyết định", "Giá trị", "Đánh đổi"
  ]);
});

test("dashboard scenarios have distinct input, four public blocks and distinct output", async ({ page }) => {
  await page.goto("/vi/projects/dashboard-insights/");
  const simulator = page.locator(".sim-shell");
  const firstPrompt = await simulator.locator(".sim-prompt-input").inputValue();
  await simulator.locator(".sim-case-pill").nth(1).click();
  const secondPrompt = await simulator.locator(".sim-prompt-input").inputValue();
  expect(secondPrompt).not.toBe(firstPrompt);

  await simulator.locator(".sim-send-btn").click();
  await expect(simulator.locator(".sim-step-active .sim-step-answers>div")).toHaveCount(4);
  await expect(simulator.locator(".sim-step-active .sim-step-answers dt")).toHaveText([
    "Điều đang diễn ra",
    "Ai hoặc công cụ nào xử lý",
    "Bước này tạo ra gì",
    "Vì sao cần và khi lỗi"
  ]);

  await simulator.locator(".sim-step-btn").last().click();
  await expect(simulator.locator(".sim-output-area")).toContainText("CLAIM BỊ LOẠI");
  await expect(simulator.locator(".sim-output-area pre")).toHaveCount(0);
  await simulator.locator(".sim-technical-drawer summary").click();
  await expect(simulator.locator(".sim-technical-drawer pre")).toContainText("DI-02");
  await expect(simulator.locator(".sim-technical-drawer pre")).toContainText("failureFixture");
});

for (const slug of slugs) {
  test(`${slug} exposes three distinct scenarios and a project renderer`, async ({ page }) => {
    await page.goto(`/en/projects/${slug}/`);
    const simulator = page.locator(".sim-shell");
    await expect(simulator.locator(".sim-case-pill")).toHaveCount(3);
    const firstPrompt = await simulator.locator(".sim-prompt-input").inputValue();
    await simulator.locator(".sim-case-pill").nth(1).click();
    await expect(simulator.locator(".sim-prompt-input")).not.toHaveValue(firstPrompt);
    await simulator.locator(".sim-send-btn").click();
    await simulator.locator(".sim-step-btn").last().click();
    await expect(simulator.locator(`.sim-output-${slug === "worldcup-analyst" ? "worldcup" : slug === "dashboard-insights" ? "dashboard" : slug === "a2a-orchestrator" ? "a2a" : slug.split("-")[0]}`)).toBeVisible();
  });
}

test("system easy mode and technical mode both expose seven readable steps", async ({ page }) => {
  await page.goto("/vi/system/");
  await expect(page.locator(".easy-system-trace li")).toHaveCount(7);
  await page.locator("#system-mode-technical").click();
  await expect(page.locator(".trace-step-list button")).toHaveCount(7);
  await expect(page.locator(".contract-inspector dt")).toHaveCount(6);
  await page.locator("#system-mode-easy").click();
  await expect(page.locator(".easy-system-trace")).toBeVisible();
});

test("learning center keeps three tracks and the English system track has 17 concepts", async ({ page }) => {
  await page.goto("/vi/learn/");
  await expect(page.locator(".learning-gate")).toHaveCount(3);
  await page.goto("/en/learn/system-concepts/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(".concept-layer button")).toHaveCount(17);
  await expect(page.locator("h1")).toContainText("AI as a system");
});

test("reduced motion preserves system controls and information", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/vi/system/");
  await expect(page.locator(".easy-system-trace li")).toHaveCount(7);
  await page.locator("#system-mode-technical").click();
  await expect(page.locator(".trace-step-list button")).toHaveCount(7);
});

test("mobile navigation restores keyboard focus", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/vi/");
  const trigger = page.getByRole("button", { name: "Menu" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Điều hướng chính" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("approved responsive widths have no page-level overflow", async ({ page }) => {
  for (const width of [320, 375, 414, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/vi/", "/vi/projects/", "/vi/system/", "/vi/projects/dashboard-insights/", "/en/learn/system-concepts/"]) {
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${route} at ${width}`).toBeLessThanOrEqual(1);
    }
  }
});

for (const route of [...coreRoutes, ...slugs.map((slug) => `/vi/projects/${slug}/`)]) {
  test(`${route} passes serious/critical axe and console checks`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(route);
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("direct refresh and custom 404 remain functional", async ({ page }) => {
  const project = await page.goto("/en/projects/a2a-orchestrator/");
  expect(project?.ok()).toBe(true);
  await page.reload();
  await expect(page.locator("h1")).toContainText("A2A Orchestrator");
  const missing = await page.goto("/route-that-does-not-exist/");
  expect(missing?.status()).toBe(404);
});
