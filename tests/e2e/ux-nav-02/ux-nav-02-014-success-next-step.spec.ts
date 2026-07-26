import { test, expect } from '@playwright/test';
import { allowAuthenticatedArea } from '../auth-helper';

test.describe('UX-NAV-02-014: Success next-step destinations - Journey validation', () => {
  test.beforeEach(async ({ page }) => {
    await allowAuthenticatedArea(page);
  });

  test('Validates destination verification (creation routes to detail view via UI interactions)', async ({ page }) => {
    await page.goto('/builder/ui-contracts/next-step-test');

    await page.click('#test-create-success');

    // UI should show the success toast/overlay with commercial language
    await expect(page.getByText('View New Entry')).toBeVisible();

    // Verify successful router navigation
    await expect(page).toHaveURL(/\/builder\/capabilities\/detail\/new-cap-123/);
  });

  test('Validates blocked destination handling (routes to safe fallback with commercial messaging)', async ({ page }) => {
    await page.goto('/builder/ui-contracts/next-step-test');

    await page.click('#test-blocked-success');

    // Validating commercial messaging in UI overlay
    await expect(page.getByText('Action Successful')).toBeVisible();
    await expect(page.getByText('Submission successful. Pending administrator review.')).toBeVisible();

    // Verifying it falls back safely to origin
    await expect(page).toHaveURL(/\/builder\/capabilities/);
  });

  test('Validates Demo/Synthetic Consistency (demo mode routes cleanly without mutations)', async ({ page }) => {
    // Navigate with demo cookie to establish context
    await page.context().addCookies([
      { name: "x-environment-mode", value: "demo", url: "http://localhost:3000" },
    ]);

    await page.goto('/builder/ui-contracts/next-step-test');

    await page.click('#test-demo-success');

    // Asserting the UI feedback specifically tailored for Demo/Simulations
    await expect(page.getByText('Simulation Complete')).toBeVisible();
    await expect(page.getByText('Analysis generated in Demo Mode.')).toBeVisible();

    // Verifying it navigates to the canned mock destination instead of a real ID
    await expect(page).toHaveURL(/\/builder\/reports\/results\/demo-job/);
  });
});
