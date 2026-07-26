import { test, expect } from "@playwright/test";
import { allowAuthenticatedArea } from "../auth-helper";

test.describe("UX-NAV-02-019 Cancel/Back/Discard Model Frontend Contract", () => {
  test.beforeEach(async ({ page }) => {
    await allowAuthenticatedArea(page);
    await page.goto("/builder/ui-contracts/cancel-back-test");
  });

  test("CANCEL action resolves gracefully without intervention and allows routing execution", async ({ page }) => {
    await page.selectOption('[data-testid="action-select"]', "CANCEL");
    await page.click('[data-testid="trigger-btn"]');

    await expect(page.locator('[data-testid="res-destination"]')).toBeVisible();
    await expect(page.locator('[data-testid="res-destination"]')).toHaveText("/builder/portfolio");

    // Action execution routing
    await page.click('[data-testid="navigate-btn"]');

    // We expect the URL to have updated
    await expect(page).toHaveURL(/.*\/builder\/portfolio/);
  });

  test("DISCARD action with dirty state triggers intervention gate and processes confirmation properly", async ({ page }) => {
    await page.selectOption('[data-testid="action-select"]', "DISCARD");
    await page.check('[data-testid="is-dirty-checkbox"]');
    await page.click('[data-testid="trigger-btn"]');

    await expect(page.locator('[data-testid="res-intervention"]')).toHaveText("Yes");
    await expect(page.locator("text=Discard Intervention Gate")).toBeVisible();

    // Confirms discard, which navigates
    await page.click('[data-testid="confirm-discard-btn"]');
    await expect(page).toHaveURL(/.*\/builder\/portfolio/);
  });

  test("DISCARD action cancellation leaves user on same page", async ({ page }) => {
    await page.selectOption('[data-testid="action-select"]', "DISCARD");
    await page.check('[data-testid="is-dirty-checkbox"]');
    await page.click('[data-testid="trigger-btn"]');

    await expect(page.locator('[data-testid="res-intervention"]')).toHaveText("Yes");

    // Cancels discard, remaining on the same route and clearing the prompt
    await page.click('[data-testid="cancel-discard-btn"]');
    await expect(page.locator("text=Discard Intervention Gate")).toBeHidden();
    await expect(page).toHaveURL(/.*\/builder\/ui-contracts\/cancel-back-test/);
  });

  test("BACK action in blocked state handles resolution properly", async ({ page }) => {
    await page.selectOption('[data-testid="action-select"]', "BACK");
    // Ensure blocked state
    await page.check("#isBlocked");
    await page.click('[data-testid="trigger-btn"]');

    await expect(page.locator('[data-testid="res-status"]')).toHaveText("blocked");
  });
});
