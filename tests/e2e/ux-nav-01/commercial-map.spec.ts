import { test, expect } from '@playwright/test';
import { allowAuthenticatedArea } from '../auth-helper';

test.describe('Commercial Map IA Frontend Experience', () => {
  test('should render commercial map correctly in builder shell', async ({ page }) => {
    await allowAuthenticatedArea(page);
    await page.goto('/builder/commercial-map');

    // It should load the component shell
    await expect(page.locator('h2', { hasText: 'Commercial Capabilities' })).toBeVisible();
    await expect(page.locator('text=Manage your active modules and access.')).toBeVisible();
  });
});
