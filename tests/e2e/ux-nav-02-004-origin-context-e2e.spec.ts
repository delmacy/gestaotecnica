import { test, expect } from '@playwright/test';
import { allowAuthenticatedArea } from './auth-helper';

test.describe('UX-NAV-02-004: Origin and active context model - Journey validation', () => {
  test.beforeEach(async ({ page }) => {
    await allowAuthenticatedArea(page);
  });

  test('Validates origin capture and return path from registry to capabilities', async ({ page }) => {
    // 1. Set environment to real
    await page.context().addCookies([{ name: 'x-environment-mode', value: 'real', url: 'http://localhost:3000' }]);

    // 2. Start at origin
    await page.goto('/builder/registry');
    await expect(page).toHaveURL(/.*\/builder\/registry/);

    // 3. Initiate action that goes deep
    const primaryBtn = page.locator("a:has-text('Define Capability')");
    await expect(primaryBtn).toBeVisible();
    await primaryBtn.click();

    // 4. Verify we are at the new context with the origin preserved
    await expect(page).toHaveURL(/.*\/builder\/capabilities\/new\?origin=%2Fbuilder%2Fregistry/);

    // 5. Check the contextual return language
    const returnLink = page.locator("a", { hasText: 'Return' }); // Since it comes from registry, resolveOriginContext defaults to "Return"
    await expect(returnLink).toBeVisible();

    // 6. Execute return
    await returnLink.click();

    // 7. Verify we are back at origin
    await expect(page).toHaveURL(/.*\/builder\/registry/);
  });

  test('Validates Contextual Return handles cross-boundary scoping', async ({ page }) => {
     // 1. Simulate invalid scope: Admin trying to hit builder action directly with a builder origin
     await page.goto('/builder/capabilities/new?origin=/admin/dashboard');

     // 2. Verify access denied alert is visible
     await expect(page.locator('text=Access Denied: Cross-Scope Boundary Alert')).toBeVisible();

     // 3. Verify safe fallback return link goes to dashboard
     const safeReturn = page.locator('a:has-text("Return to Dashboard")');
     await expect(safeReturn).toBeVisible();
     await expect(safeReturn).toHaveAttribute('href', '/builder/dashboard');
  });

  test('Validates Contextual Return dynamic language based on origin', async ({ page }) => {
      // 1. Start at new capability with operations origin
      await page.goto('/builder/capabilities/new?origin=/builder/operations');

      // 2. Verify specific contextual language
      const opsReturn = page.locator('a:has-text("Return to Operations")');
      await expect(opsReturn).toBeVisible();
  });
});

test.describe('UX-NAV-02-004: Origin and active context model - State validation', () => {
  test.beforeEach(async ({ page }) => {
    await allowAuthenticatedArea(page);
  });

  test('Validates Demo State interception', async ({ page }) => {
      // Demo State logic intercepts and handles states
      await page.context().addCookies([{ name: 'x-environment-mode', value: 'demo', url: 'http://localhost:3000' }]);
      await page.goto('/builder/capabilities/new?origin=/builder/operations');

      // Verify visual badge for demo state based on context
      const demoBadge = page.locator('.bg-orange-100', { hasText: 'DEMO MODE' }); // Based on EnvironmentBadge implementation
      await expect(demoBadge.first()).toBeVisible();
  });

  test('Validates Synthetic State persistence', async ({ page }) => {
      await page.context().addCookies([{ name: 'x-environment-mode', value: 'synthetic', url: 'http://localhost:3000' }]);
      await page.goto('/builder/capabilities/new?origin=/builder/operations');

      const syntheticBadge = page.locator('.bg-amber-100', { hasText: 'SYNTHETIC MODE' });
      await expect(syntheticBadge.first()).toBeVisible();
  });
});
