import { test, expect } from "@playwright/test";
import { allowAuthenticatedArea } from "./auth-helper";

test.describe("UX-NAV-01-049: Navigation foundation regression gate - Journey validation", () => {
  test.beforeEach(async ({ page }) => {
    await allowAuthenticatedArea(page);
  });

  test("Root Routing: base route /builder resolves to Workspace Dashboard", async ({ page }) => {
    await page.goto("/builder");
    // Instead of h1 Dashboard, let's verify dashboard from breadcrumbs or main view
    await expect(page.getByRole("link", { name: "Dashboard / Home" })).toBeVisible();
    await expect(page).toHaveURL(/.*\/builder$/);
  });

  test("Deep Linking: unauthenticated redirect", async ({ context, page }) => {
    await context.clearCookies();
    await page.goto("/builder/tasker");
    await expect(page).toHaveURL(/.*\/auth\/login.*/);
  });

  test("Unknown Routes: resolve gracefully to NotFound state", async ({ page }) => {
    await page.goto("/builder/unknown-module-12345");
    // We expect a Not Found / unknown route page
    await expect(page.getByText("Seção não encontrada")).toBeVisible();
  });

  test("Validates Real-Data State", async ({ page }) => {
    await page.context().addCookies([
      { name: "x-environment-mode", value: "real", url: "http://localhost:3000" },
    ]);
    await page.goto("/builder/capabilities");
    await expect(page.locator("h1", { hasText: "Capabilities globais" })).toBeVisible();
  });

  test("Validates Synthetic State", async ({ page }) => {
    await page.context().addCookies([
      { name: "x-environment-mode", value: "synthetic", url: "http://localhost:3000" },
    ]);
    await page.goto("/builder");
    await expect(page.getByText("SYNTHETIC MODE")).toBeVisible();
  });

  test("Validates Demo State", async ({ page }) => {
    await page.context().addCookies([
      { name: "x-environment-mode", value: "demo", url: "http://localhost:3000" },
    ]);
    await page.goto("/builder");
    await expect(page.getByText("DEMO MODE")).toBeVisible();
  });

  test("Validates Blocked State", async ({ page }) => {
    await page.context().addCookies([
      { name: "x-environment-mode", value: "real", url: "http://localhost:3000" },
    ]);
    await page.goto("/builder/capabilities");
    const subduedCard = page.locator('.opacity-60.grayscale').first();
    await subduedCard.click();
    await expect(page.locator('div', { hasText: 'Em Breve / Coming Soon' }).first()).toBeVisible();
  });

  test("Validates Empty State", async ({ page }) => {
    await page.context().addCookies([
      { name: "x-environment-mode", value: "real", url: "http://localhost:3000" },
    ]);
    await page.goto("/builder/work-items");
    await expect(page.getByText("Seção não encontrada")).toBeVisible();
  });

});
