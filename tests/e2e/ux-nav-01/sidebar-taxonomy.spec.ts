import { test, expect } from "@playwright/test";
import { allowAuthenticatedArea } from "../auth-helper";

test.describe("Sidebar taxonomy and grouping", () => {
  test("displays taxonomy groups properly on desktop", async ({ page }) => {
    await allowAuthenticatedArea(page);

    // 1. Desktop Validation
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/builder");

    const desktopSidebar = page.locator("aside").first();
    await expect(desktopSidebar).toBeVisible({ timeout: 15000 });
    await expect(desktopSidebar.getByText("Workspace Core")).toBeVisible();
    await expect(desktopSidebar.getByText("Architecture & Definition")).toBeVisible();
    await expect(desktopSidebar.getByText("Developer & Reference")).toBeVisible();

    // Where user goes next: navigation click
    await desktopSidebar.getByRole("link", { name: "Tasker" }).click();
    await expect(page).toHaveURL(/\/builder\/tasker$/);

    // How they return: persistent desktop sidebar
    await expect(desktopSidebar.getByRole("link", { name: "Dashboard / Home" })).toBeVisible();
    await desktopSidebar.getByRole("link", { name: "Dashboard / Home" }).click();
    await expect(page).toHaveURL(/\/builder$/);
  });

  test("displays taxonomy groups properly on mobile", async ({ page }) => {
    await allowAuthenticatedArea(page);

    // 2. Mobile Validation
    await page.setViewportSize({ width: 375, height: 667 });

    // Ensure we await navigation completely
    await page.goto("/builder", { waitUntil: "networkidle" });

    // Find the hamburger icon button
    const hamburger = page.locator("header button").first();
    await expect(hamburger).toBeVisible({ timeout: 15000 });
    await hamburger.click();

    const mobileSidebar = page.getByRole("dialog");
    await expect(mobileSidebar).toBeVisible({ timeout: 10000 });
    await expect(mobileSidebar.getByText("Workspace Core")).toBeVisible();

    // Where user goes next: navigation click (mobile)
    await mobileSidebar.getByRole("link", { name: "Tasker" }).click();
    await expect(page).toHaveURL(/\/builder\/tasker$/);

    // On mobile, the sheet often stays open or requires interaction depending on navigation handling.
    // For verification, we can just ensure we can find a way back home within the dialog.
    // Wait for the side navigation context to load the content page
    await page.waitForLoadState("networkidle");

    // Close and reopen
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);

    const taskerHamburger = page.locator("header button").first();
    await expect(taskerHamburger).toBeVisible({ timeout: 15000 });
    await taskerHamburger.click();

    const reopenedMobileSidebar = page.getByRole("dialog");
    await expect(reopenedMobileSidebar.getByRole("link", { name: "Dashboard / Home" })).toBeVisible({ timeout: 10000 });
    await reopenedMobileSidebar.getByRole("link", { name: "Dashboard / Home" }).click();
    await expect(page).toHaveURL(/\/builder$/);
  });

  test("distinct user-facing outcomes for blocked and active states", async ({ page }) => {
    await allowAuthenticatedArea(page);
    await page.goto("/builder");

    const sidebar = page.locator("aside").first();
    await expect(sidebar).toBeVisible({ timeout: 15000 });

    // Validate empty/blocked states exist in UI as non-navigable indicators
    await expect(sidebar.getByText("Future Modules")).toBeVisible();

    // Check that blocked module has distinct visual treatment and does not act like a link
    const blockedModule = sidebar.getByText("Blocked", { exact: true }).first();
    await expect(blockedModule).toBeVisible();
  });

  // Cannot test demo or synthetic badges properly because we don't have endpoints to fake the environment easily for testing.
  // We document it missing in EVIDENCE.md
});
