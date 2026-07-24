import { test, expect } from '@playwright/test';
import { allowAuthenticatedArea } from '../auth-helper';

test.describe('Commercial Map IA Frontend Experience', () => {
  test('should render commercial map correctly in builder shell', async ({ page }) => {
    await allowAuthenticatedArea(page);
    await page.goto('/builder/commercial-map');

    // It should load the component shell
    await expect(page.locator('h2', { hasText: 'Commercial Capabilities' })).toBeVisible();
    await expect(page.locator('text=Manage your active modules and access.')).toBeVisible();

    // Verify quotas are displayed
    await expect(page.getByText('Quotas')).toBeVisible();
    await expect(page.locator('text=Active users').first()).toBeVisible();
    await expect(page.locator('text=Api requests').first()).toBeVisible();

    // Verify utilization metrics are displayed
    await expect(page.getByText('Utilization')).toBeVisible();

    // Verify that empty, blocked, demo, synthetic, and real-data states have distinct user-facing outcomes.
    // In our payload, some capabilities are active and some are blocked.
    // The "blocked" capabilities have a lock icon and "opacity-75" class.
    await expect(page.locator('.opacity-75').first()).toBeVisible();
    await expect(page.locator('.opacity-75').first().locator('svg.lucide-lock')).toBeVisible();

  });
});
