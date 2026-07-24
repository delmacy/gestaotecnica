import { test, expect } from "@playwright/test";
import { allowAuthenticatedArea } from "../auth-helper";

test.describe("Sidebar taxonomy and grouping", () => {
  test("displays taxonomy groups properly on desktop", async ({ page }) => {
    await allowAuthenticatedArea(page);
    await page.goto("/builder");

    const sidebar = page.locator("aside").first();
    await expect(sidebar).toBeVisible();

    // Verify taxonomy groupings
    await expect(sidebar.getByText("Workspace Core")).toBeVisible();
    await expect(sidebar.getByText("Architecture & Definition")).toBeVisible();
    await expect(sidebar.getByText("Developer & Reference")).toBeVisible();

    // Verify specific links within groups exist based on contract
    await expect(sidebar.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Capabilities" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Registry" })).toBeVisible();
  });
});
