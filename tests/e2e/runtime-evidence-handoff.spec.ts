import { test, expect } from "@playwright/test";
import { allowAuthenticatedArea } from "./auth-helper";

test.describe("Runtime Evidence Handoff Contract", () => {
  test.beforeEach(async ({ page }) => {
    await allowAuthenticatedArea(page);
    // Navigate to the UI contract test page
    await page.goto("/runtime/ui-contracts/evidence-handoff-test");
  });

  test("Real-Data State: Official Record Captured", async ({ page }) => {
    await page.getByTestId("btn-success").click();

    const result = page.getByTestId("result-success");
    await expect(result).toBeVisible();
    await expect(result.getByTestId("status-text")).toHaveText("Official Record Captured");

    // Receipt button should be visible
    await expect(page.getByTestId("btn-view-receipt")).toBeVisible();
    await expect(page.getByTestId("btn-next-task")).toBeVisible();
  });

  test("Demo State: Logged to Demo Vault", async ({ page }) => {
    await page.getByTestId("btn-demo").click();

    const result = page.getByTestId("result-demo");
    await expect(result).toBeVisible();
    await expect(result.getByTestId("status-text")).toHaveText("Logged to Demo Vault");
  });

  test("Synthetic Data State: Synthetic Record", async ({ page }) => {
    await page.getByTestId("btn-synthetic").click();

    const result = page.getByTestId("result-synthetic");
    await expect(result).toBeVisible();
    await expect(result.getByTestId("status-text")).toHaveText("Synthetic Record");
  });

  test("Blocked State: Submission Restricted", async ({ page }) => {
    await page.getByTestId("btn-blocked").click();

    const result = page.getByTestId("result-blocked");
    await expect(result).toBeVisible();
    await expect(result.getByTestId("status-text")).toHaveText("Submission Restricted");
  });

  test("Empty State: Required information missing", async ({ page }) => {
    await page.getByTestId("btn-empty").click();

    const result = page.getByTestId("result-empty");
    await expect(result).toBeVisible();
    await expect(result.getByTestId("status-text")).toHaveText("Required information missing");
  });

  test("Navigation: View Evidence Receipt routes correctly", async ({ page }) => {
    await page.getByTestId("btn-success").click();

    const receiptBtn = page.getByTestId("btn-view-receipt");
    await expect(receiptBtn).toBeVisible();

    // Test navigation push works
    await receiptBtn.click();
    await expect(page).toHaveURL(/.*\/runtime\/evidence\/.*\/receipt/);
  });
});
