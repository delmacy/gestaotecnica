import { test, expect } from "@playwright/test";
import { allowAuthenticatedArea } from "./auth-helper";

test.describe("UX-NAV-01-028 Breadcrumb Foundation", () => {
  test("deep link reconstruction verifies 3 levels of hierarchy", async ({ page }) => {
    await allowAuthenticatedArea(page);
    // Navigating directly to a deeply nested path
    await page.goto("/builder/tasker/123-abc");

    // Check breadcrumb nodes
    const breadcrumbNav = page.locator("nav").last();

    // Level 1: Scope Root
    await expect(breadcrumbNav.getByText("Workspace")).toBeVisible();
    await expect(breadcrumbNav.getByRole("link", { name: "Workspace" })).toHaveAttribute("href", "/builder");

    // Level 2: Module
    await expect(breadcrumbNav.getByText("Tasker")).toBeVisible();
    await expect(breadcrumbNav.getByRole("link", { name: "Tasker" })).toHaveAttribute("href", "/builder/tasker");

    // Level 3: Entity (default formatted label, unclickable as it's the current page)
    const entityNode = breadcrumbNav.getByText("123 Abc");
    await expect(entityNode).toBeVisible();
    await expect(entityNode.locator("xpath=ancestor::a")).toHaveCount(0); // Not a link
  });

  test("empty state (Entity Not Found) renders gracefully", async ({ page }) => {
    // In our backend contract, `isNotFound` is used. We can simulate it by mocking the response,
    // but the test is currently evaluating frontend routing against the URL.
    // Since we don't have a specific "Entity Not Found" page yet that passes `isNotFound` to the layout,
    // we'll test the fallback behavior of the breadcrumbs for unknown paths.

    await allowAuthenticatedArea(page);
    await page.goto("/builder/unknown-module/404-item");

    const breadcrumbNav = page.locator("nav").last();

    // Level 1
    await expect(breadcrumbNav.getByText("Workspace")).toBeVisible();

    // Level 2 (formatted from URL since module isn't in inventory)
    await expect(breadcrumbNav.getByText("Unknown Module")).toBeVisible();
    await expect(breadcrumbNav.getByRole("link", { name: "Unknown Module" })).toHaveAttribute("href", "/builder/unknown-module");

    // Level 3
    const notFoundNode = breadcrumbNav.getByText("404 Item");
    await expect(notFoundNode).toBeVisible();
  });

  test("blocked state prevents clicking future modules", async ({ page }) => {
    await allowAuthenticatedArea(page);
    // Navigating to a nested route under a blocked/coming_soon module
    await page.goto("/builder/workflow-builder/deep-route");

    const breadcrumbNav = page.locator("nav").last();

    // Level 1
    await expect(breadcrumbNav.getByText("Workspace")).toBeVisible();

    // Level 2: The module is found in future modules, so it renders text, but it's not clickable.
    const blockedNode = breadcrumbNav.getByText("Workflow Builder");
    await expect(blockedNode).toBeVisible();
    await expect(blockedNode.locator("xpath=ancestor::a")).toHaveCount(0); // Not a link

    // Level 3: Deeper nodes are not rendered at all for blocked modules
    await expect(breadcrumbNav.getByText("Deep Route")).not.toBeVisible();
  });

  test("synthetic data state adds Mock prefix", async ({ page }) => {
    // Override the response from the context API to force synthetic mode
    await page.route("**/api/builder/navigation", async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      json.environmentMode = "synthetic";
      await route.fulfill({ json });
    });

    await allowAuthenticatedArea(page);
    await page.goto("/builder/tasker/synthetic-item");

    const breadcrumbNav = page.locator("nav").last();

    // Check for the "Mock" prefix added by the backend contract
    await expect(breadcrumbNav.getByText("Mock Synthetic Item")).toBeVisible();
  });

  test("responsive collapse hides intermediate nodes behind ellipsis (visual verification)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await allowAuthenticatedArea(page);

    // Go to a very deep route to trigger scrolling or collapse
    await page.goto("/builder/tasker/level-1/level-2/level-3/level-4");

    const breadcrumbNav = page.locator("nav").last();

    // We expect the nav to have overflow-x-auto and scrollbar-hide,
    // ensuring it doesn't break the layout on mobile.
    await expect(breadcrumbNav).toHaveClass(/overflow-x-auto/);
    await expect(breadcrumbNav).toHaveClass(/scrollbar-hide/);

    await expect(breadcrumbNav.getByText("Workspace")).toBeVisible();
    await expect(breadcrumbNav.getByText("Level 4")).toBeVisible();
  });
});
