import { test, expect } from "@playwright/test";
import { allowAuthenticatedArea } from "./auth-helper";

test.describe("Builder Navigation E2E", () => {
  test("displays the correct subset of active menu items on dashboard", async ({ page }) => {
    await allowAuthenticatedArea(page);
    await page.goto("/builder");

    // Wait for dashboard to load
    await expect(page.getByRole("heading", { name: "System Builder" })).toBeVisible();

    // The user can see the correct subset of active menu items from navigation-inventory.ts
    // Dashboard is always active
    const sidebar = page.locator("aside").first();
    await expect(sidebar.getByRole("link", { name: "Dashboard / Home" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Tasker" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Capabilities" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Registry" })).toBeVisible();

    // Form Builder is blocked in the default E2E payload (not in enabledModules)
    // Verify it is rendered as a non-link with restricted interaction according to the contract
    const formBuilderBlocked = sidebar.locator('div[title="Pro Feature"]', { hasText: "Form Builder" });
    await expect(formBuilderBlocked).toBeVisible();
    // Ensure it's not a link
    await expect(sidebar.getByRole("link", { name: "Form Builder" })).not.toBeVisible();

    // Based on the contract, we can also check that some active items are in the main area's module grid
    // For example, Tasker should have a visible link card if it's active
    const taskerGridLink = page.locator("main").getByRole("link", { name: /Tasker/i }).first();
    await expect(taskerGridLink).toBeVisible();
  });

  test("navigates to a module and observes URL and breadcrumbs updating", async ({ page }) => {
    await allowAuthenticatedArea(page);
    await page.goto("/builder");

    // Wait for dashboard to load
    await expect(page.getByRole("heading", { name: "System Builder" })).toBeVisible();

    // Navigate to Tasker
    const taskerLink = page.locator('nav a[href="/builder/tasker"]').first();
    await taskerLink.click();

    // Verify URL
    await expect(page).toHaveURL(/\/builder\/tasker$/);

    // Verify Breadcrumbs. The BreadcrumbHeader component outputs "Workspace" and the module label
    const breadcrumbNav = page.locator("nav").filter({ hasText: "Workspace" }).last();
    await expect(breadcrumbNav.getByText("Workspace")).toBeVisible();
    await expect(breadcrumbNav.getByText("Tasker")).toBeVisible();
  });

  test("mobile sidebar collapse validation", async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    await allowAuthenticatedArea(page);
    await page.goto("/builder");

    // Hamburger menu should be visible on mobile
    const hamburgerMenu = page.getByRole("button", { name: "Open Menu" });
    await expect(hamburgerMenu).toBeVisible();

    // Click to open sidebar
    await hamburgerMenu.click();

    // The sheet sidebar should open and we should see navigation items
    const sheetSidebar = page.getByRole("dialog");
    await expect(sheetSidebar).toBeVisible();

    // Check for a link inside the mobile sidebar
    const taskerLink = sheetSidebar.locator('a[href="/builder/tasker"]').first();
    await expect(taskerLink).toBeVisible();
  });
});
