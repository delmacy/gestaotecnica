import { test, expect } from "@playwright/test";
import { allowAuthenticatedArea } from "./auth-helper";

test.describe("UX-NAV-01-044: Typed menu metadata contract - Journey validation", () => {
  test.beforeEach(async ({ page }) => {
    await allowAuthenticatedArea(page);
  });

  test("Validates Real-Data State journey (baseline) - all core modules visible and interactive", async ({ page }) => {
    // 1. Enter the system and land on dashboard
    await page.context().addCookies([
      { name: "x-environment-mode", value: "real", url: "http://localhost:3000" },
    ]);
    await page.goto("/builder");

    // 2. What they do here: Interpret visual cues for operational modules
    // Assert Sidebar is loaded with navigation modules
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toBeVisible();

    // Verify Dashboard is an active navigation link
    const dashboardLink = sidebar.getByRole('link', { name: 'Dashboard / Home' });
    await expect(dashboardLink).toBeVisible();
    await expect(dashboardLink).toHaveAttribute('href', '/builder');
    // Verify it indicates active state (aria-current="page")
    await expect(dashboardLink).toHaveAttribute('aria-current', 'page');

    // Verify Tasker is visible
    const taskerLink = sidebar.getByRole('link', { name: 'Tasker' });
    await expect(taskerLink).toBeVisible();
    await expect(taskerLink).toHaveAttribute('href', '/builder/tasker');

    // 3. Where they go next: Select an operational module
    await taskerLink.click();
    await expect(page).toHaveURL(/.*\/builder\/tasker/);

    // Verify Sidebar updates active state
    await expect(taskerLink).toHaveAttribute('aria-current', 'page');
    await expect(dashboardLink).not.toHaveAttribute('aria-current', 'page');

    // 4. How they return: Navigate back to dashboard using menu
    await dashboardLink.click();
    await expect(page).toHaveURL(/.*\/builder$/);
  });

  test("Validates Demo/Synthetic State journeys show mode indicator", async ({ page }) => {
    await page.context().addCookies([
      { name: "x-environment-mode", value: "demo", url: "http://localhost:3000" },
    ]);
    await page.goto("/builder");

    // Topbar should display DEMO MODE indicator
    await expect(page.getByText("DEMO MODE")).toBeVisible();

    // Change to synthetic
    await page.context().addCookies([
      { name: "x-environment-mode", value: "synthetic", url: "http://localhost:3000" },
    ]);
    await page.reload();

    // Topbar should display SYNTHETIC MODE indicator
    await expect(page.getByText("SYNTHETIC MODE")).toBeVisible();

    // Navigation modules should still be present
    const sidebar = page.locator('aside').first();
    await expect(sidebar.getByRole('link', { name: 'Capabilities' })).toBeVisible();
  });

  test("Validates Blocked State journey in menu", async ({ page }) => {
    await page.context().addCookies([
      { name: "x-environment-mode", value: "real", url: "http://localhost:3000" },
    ]);
    await page.goto("/builder");

    const sidebar = page.locator('aside').first();

    // Future modules like Runtime should be blocked
    const runtimeItem = sidebar.getByText("Runtime");
    await expect(runtimeItem).toBeVisible();

    // Find the closest parent list item that contains 'Runtime'
    const runtimeLi = sidebar.locator('li', { hasText: 'Runtime' });

    // Verify it has the Blocked badge
    await expect(runtimeLi.getByText("Blocked")).toBeVisible();

    // Verify it is NOT a link (it's rendered as a div with opacity-50 and cursor-not-allowed)
    // and instead has restricted interaction
    const runtimeDiv = runtimeLi.locator('div').first();
    await expect(runtimeDiv).toHaveClass(/cursor-not-allowed/);
    await expect(runtimeDiv).toHaveClass(/text-muted-foreground\/50/);

    // In future modules, the title is `Status: blocked`
    await expect(runtimeDiv).toHaveAttribute('title', 'Status: blocked');
  });

  test("Verify Responsive Navigation on Mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });

    await page.context().addCookies([
      { name: "x-environment-mode", value: "real", url: "http://localhost:3000" },
    ]);
    await page.goto("/builder");

    // Sidebar should be hidden on mobile
    const desktopSidebar = page.locator('aside.hidden.md\\:flex');
    await expect(desktopSidebar).not.toBeVisible();

    // Topbar should show the mobile menu button
    const menuButton = page.getByRole('button', { name: 'Open Menu' });
    await expect(menuButton).toBeVisible();

    // Open the mobile menu
    await menuButton.click();

    // Wait for the SheetContent to be visible
    const mobileSidebar = page.getByRole('dialog').locator('aside');
    await expect(mobileSidebar).toBeVisible();

    // Verify navigation links are accessible in the mobile menu
    const taskerLink = mobileSidebar.getByRole('link', { name: 'Tasker' });
    await expect(taskerLink).toBeVisible();

    // Click a link and verify navigation
    await taskerLink.click();
    await expect(page).toHaveURL(/.*\/builder\/tasker/);
  });
});
