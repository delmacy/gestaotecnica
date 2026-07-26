import { test, expect } from "@playwright/test";
import { allowAuthenticatedArea } from "./auth-helper";

test.describe("Primary Action Model", () => {
  test("Blocked state correctly disables button and shows tooltip", async ({ page }) => {
    await allowAuthenticatedArea(page);

    // Ensure we are in demo mode by setting cookie or just using default which is often real
    await page.context().addCookies([{ name: "x-environment-mode", value: "demo", url: "http://localhost:3000" }]);
    await page.goto("/builder/work-items"); // Assuming work-items has "Log New Task"

    // Verify button is disabled (or has a disabled prop/aria attribute)
    const button = page.locator("button:has-text('Log New Task')");
    // Depending on how blocked is implemented, it might be disabled
    await expect(button).toBeDisabled();

    // The title attribute contains the tooltip message
    await expect(button).toHaveAttribute("title", "Action restricted in Demo Mode");
  });

  test("Active state navigates to correct next step", async ({ page }) => {
    await allowAuthenticatedArea(page);
     // Set real mode to allow actions
    await page.context().addCookies([{ name: "x-environment-mode", value: "real", url: "http://localhost:3000" }]);
    await page.goto("/builder/registry");

    const button = page.locator("a:has-text('Define Capability')");
    await expect(button).toHaveAttribute("href", "/builder/capabilities/new?origin=%2Fbuilder%2Fregistry");

    await button.click();
    await expect(page).toHaveURL(/.*\/builder\/capabilities\/new/);
  });
});
