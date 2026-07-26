import { test, expect } from "@playwright/test";
import { allowAuthenticatedArea } from "../auth-helper";

test.describe("UX-NAV-02-004: Origin and active context model - Journey validation", () => {
  test.beforeEach(async ({ page }) => {
    await allowAuthenticatedArea(page);
  });

  test("Validates Origin Preservation when navigating deep and returning", async ({ page }) => {
    // Navigate to a module list view (origin)
    await page.goto("/builder/registry");

    // Check we are on the origin
    await expect(page.locator("h1", { hasText: "Registry View" })).toBeVisible();

    // Navigate to create new (deep view)
    const newButton = page.locator("a[href='/builder/capabilities/new?origin=%2Fbuilder%2Fregistry']");
    await expect(newButton).toBeVisible();
    await newButton.click();

    // Wait for context URL parameter
    await expect(page).toHaveURL(/.*\/builder\/capabilities\/new/);

    // Verify Cancel/Return button exists and returns to origin
    await expect(page.locator("h1", { hasText: "Create New Capability" })).toBeVisible();

    const cancelBtn = page.locator("a", { hasText: "Return" });
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();

    // Ensure we returned safely to origin
    await expect(page).toHaveURL(/\/builder\/registry$/);
    await expect(page.locator("h1", { hasText: "Registry View" })).toBeVisible();
  });

  test("Validates State-Aware Empty State return paths", async ({ page }) => {
    // Navigate to an unknown or not implemented module to see empty/not found state
    await page.goto("/builder/work-intake");

    // Verify distinct empty/unavailable UI outcomes
    await expect(page.locator("h1", { hasText: "Seção não encontrada" })).toBeVisible();

    const returnLink = page.locator("a:has-text('Voltar para o Dashboard')");
    await expect(returnLink).toBeVisible();
  });

  test("Validates State-Aware Blocked State outcomes", async ({ page }) => {
    // Navigate to a known blocked state (e.g. Form Builder from earlier tests)
    await page.goto("/builder");
    const formBuilderBlocked = page.locator('div[title="Pro Feature"]', { hasText: "Form Builder" });
    await expect(formBuilderBlocked).toBeVisible();
  });

  test("Validates Synthetic Data State visuals", async ({ page }) => {
    await page.context().addCookies([
      { name: "x-environment-mode", value: "synthetic", url: "http://localhost:3000" },
    ]);
    await page.goto("/builder/registry");
    await expect(page.locator("text=SYNTHETIC MODE")).toBeVisible();

    // Navigate deep and ensure synthetic persists
    const newButton = page.locator("a[href='/builder/capabilities/new?origin=%2Fbuilder%2Fregistry']");
    await newButton.click();
    await expect(page.locator("text=SYNTHETIC MODE")).toBeVisible();
  });

  test("Validates Platform vs Workspace Boundary Isolation", async ({ page }) => {
    // An action originating in a workspace must return to that workspace; cross-scope return paths are strictly prohibited

    await page.goto("/builder/capabilities/new?origin=/admin/users");
    // Depending on implementation, it should either strip it, ignore it, or force safe fallback.
    // The contract states "cross-scope return paths are strictly prohibited"

    const returnLink = page.locator("a[href='/builder/dashboard']"); // fallback based on debug
    await expect(returnLink).toBeVisible();
  });
});
