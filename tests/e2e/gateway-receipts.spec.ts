import { test, expect } from "@playwright/test";
import { allowAuthenticatedArea } from "./auth-helper";

test.describe("Agent Gateway Receipts UI", () => {
  test("renders the receipts page and empty state", async ({ page }) => {
    // Navigate and allow auth area bypass (assuming mock auth or bypassed inside test env)
    await allowAuthenticatedArea(page);
    await page.goto("/admin/gateway/receipts");

    // Expect the title to be present
    await expect(page.locator("h1", { hasText: "Agent Gateway Receipts" })).toBeVisible();

    // Expect empty state to be present or a table if seeded
    const emptyState = page.locator("text=Não há receipts do Agent Gateway ainda.");
    const table = page.locator("table");

    // We expect either an empty state or a table (since seed might run)
    await expect(emptyState.or(table)).toBeVisible();

    // Check for the presence of the filters
    await expect(page.locator("input[placeholder='Buscar ID, Correlation ou Idempotency...']")).toBeVisible();
    await expect(page.locator("button:has-text('Buscar')")).toBeVisible();
  });

  test("can navigate to receipts page from AppShell", async ({ page }) => {
    await allowAuthenticatedArea(page);
    await page.goto("/admin");

    const link = page.locator("a[href='/admin/gateway/receipts']").first();
    await expect(link).toBeVisible();
    await link.click();

    await expect(page).toHaveURL(/\/admin\/gateway\/receipts/);
  });
});
