import { test, expect } from "@playwright/test";
import { allowAuthenticatedArea } from "./auth-helper";

test.describe("UX-NAV-02-003: Origin and active context model - Frontend experience", () => {
  test.beforeEach(async ({ page }) => {
    await allowAuthenticatedArea(page);
  });

  test("Validates Origin Preservation (Real-Data state, explicit origin via search param)", async ({ page }) => {
    // Navigate with a specific origin context
    await page.goto("/work-items/00000000-0000-0000-0000-000000000001?origin=/builder/operations");

    const returnLink = page.locator('a[href="/builder/operations"]');
    await expect(returnLink).toBeVisible();
    await expect(returnLink).toHaveAttribute("href", "/builder/operations");
  });

  test("Validates Fallback to root context when no origin is provided (Deep link)", async ({ page }) => {
    // Navigate without origin context
    await page.goto("/service-orders/00000000-0000-0000-0000-000000000002");

    const returnLink = page.locator('a[href="/builder"]');
    await expect(returnLink).toBeVisible();
    await expect(returnLink).toHaveAttribute("href", "/builder");
  });

  test("Validates Cross-scope Blocked State (Admin context forced into Workspace component)", async ({ page }) => {
    // Navigating from an admin context to a workspace component should trigger the invalid scope return logic
    await page.goto("/work-items/00000000-0000-0000-0000-000000000001?origin=/admin/settings");

    // Expect fallback return label and path
    const returnLink = page.locator('a[href="/builder/dashboard"]');
    await expect(returnLink).toBeVisible();
    await expect(returnLink).toHaveAttribute("href", "/builder/dashboard");
  });

  test("Validates Demo State Badge Surfacing", async ({ page }) => {
    await page.context().addCookies([
      { name: "x-environment-mode", value: "demo", url: "http://localhost:3000" },
    ]);
    await page.goto("/work-intake/00000000-0000-0000-0000-000000000003");

    const demoBadge = page.locator('span', { hasText: 'DEMO MODE' });
    await expect(demoBadge).toBeVisible();
  });

  test("Validates Synthetic State Badge Surfacing", async ({ page }) => {
    await page.context().addCookies([
      { name: "x-environment-mode", value: "synthetic", url: "http://localhost:3000" },
    ]);
    await page.goto("/service-orders/00000000-0000-0000-0000-000000000004");

    const syntheticBadge = page.locator('span', { hasText: 'SYNTHETIC MODE' });
    await expect(syntheticBadge).toBeVisible();
  });

  test("Verify Responsive Navigation on Mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/work-items/00000000-0000-0000-0000-000000000005?origin=/builder/operations");

    // Return to Operations link should still be visible on mobile
    const returnLink = page.locator('a[href="/builder/operations"]');
    await expect(returnLink).toBeVisible();
  });
});
