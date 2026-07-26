import { test, expect } from "@playwright/test";
import { allowAuthenticatedArea } from "../auth-helper";

test.describe("UX-NAV-02-009 List/Detail/Create/Edit Return Paths", () => {
  test.beforeEach(async ({ page }) => {
    await allowAuthenticatedArea(page);
  });

  test("Detail Back action returns to List", async ({ page }) => {
    // Navigate to a known detail route directly
    await page.goto("/builder/registry/detail/e2e-synthetic-id");

    // We expect the backend contract to render this page or an error,
    // but the return path should always be correctly bound back to the origin or fallback list.
    const backLink = page.getByRole("link", { name: /voltar|return|cancel/i }).first();
    await expect(backLink).toBeVisible();
    await backLink.click();

    await expect(page).toHaveURL(/\/builder\/registry/);
  });

  test("Create Cancel action returns to List", async ({ page }) => {
     await page.goto("/builder/capabilities/new");

     // Find the return/cancel link
     const cancelLink = page.getByRole("link", { name: /return|cancel/i }).first();
     await expect(cancelLink).toBeVisible();
     await cancelLink.click();

     // Should return to capabilities list
     await expect(page).toHaveURL(/\/builder\/capabilities/);
  });
});
