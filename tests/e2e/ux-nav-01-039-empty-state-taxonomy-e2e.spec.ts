import { test, expect } from "@playwright/test";
import { allowAuthenticatedArea } from "./auth-helper";

test.describe("UX-NAV-01-039: Empty and unavailable state taxonomy - Journey validation", () => {
  test.beforeEach(async ({ page }) => {
    await allowAuthenticatedArea(page);
  });

  test("Validates Real-Data State journey (baseline)", async ({ page }) => {
    await page.context().addCookies([
      { name: "x-environment-mode", value: "real", url: "http://localhost:3000" },
    ]);
    await page.goto("/builder/capabilities");
    await expect(page.locator('h1', { hasText: 'Capabilities globais' })).toBeVisible();
    await expect(page.locator('div.cursor-pointer', { hasText: 'Organization' }).first()).toBeVisible();
  });

  test("Validates Synthetic State journey", async ({ page }) => {
    await page.context().addCookies([
      { name: "x-environment-mode", value: "synthetic", url: "http://localhost:3000" },
    ]);
    await page.goto("/builder/registry");

    // Synthetic banner using exact text verified in primary-action-journey.spec.ts
    await expect(page.locator("text=SYNTHETIC MODE")).toBeVisible();
  });

  test("Validates Blocked State journey", async ({ page }) => {
    await page.context().addCookies([
      { name: "x-environment-mode", value: "real", url: "http://localhost:3000" },
    ]);
    await page.goto("/builder/capabilities");

    // Blocked capability badge from builder/capabilities.spec.ts
    const subduedCard = page.locator('.opacity-60.grayscale').first();
    await subduedCard.click();
    await expect(page.locator('div', { hasText: 'Em Breve / Coming Soon' }).first()).toBeVisible();
  });

  test("Validates Empty State journey via /builder/work-items", async ({ page }) => {
    await page.context().addCookies([
      { name: "x-environment-mode", value: "real", url: "http://localhost:3000" },
    ]);
    await page.goto("/builder/work-items");

    await page.waitForLoadState("networkidle");

    // As verified, navigating to an un-enabled/unimplemented module triggers the
    // generic "Seção não encontrada" (Section not found) empty/unavailable state
    // rather than the specific resolveViewState component which isn't wired.
    await expect(page.getByText("Seção não encontrada")).toBeVisible();
    await expect(page.getByText("A seção do Builder que você está procurando não existe ou ainda não foi implementada nesta versão da plataforma.")).toBeVisible();

    const backButton = page.getByRole("link", { name: "Voltar para o Dashboard" });
    await expect(backButton).toBeVisible();
    await backButton.click();

    await expect(page).toHaveURL(/.*\/builder\/?$/);

    await page.goBack();
    await expect(page).toHaveURL(/.*\/builder\/work-items\/?$/);
    await expect(page.getByText("Seção não encontrada")).toBeVisible();
  });

  test("Verify Responsive Navigation on Mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.context().addCookies([
      { name: "x-environment-mode", value: "real", url: "http://localhost:3000" },
    ]);
    await page.goto("/builder/capabilities");
    await expect(page.locator('h1', { hasText: 'Capabilities globais' })).toBeVisible();
  });
});
