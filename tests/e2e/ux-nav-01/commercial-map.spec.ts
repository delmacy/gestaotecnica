import { test, expect } from '@playwright/test';
import { allowAuthenticatedArea } from '../auth-helper';

test.describe('Commercial Map IA Frontend Experience', () => {
  test('should render commercial map correctly in builder shell', async ({ page }) => {
    await allowAuthenticatedArea(page);
    await page.goto('/builder/commercial-map');

    // Due to possible UI wording updates from recent tasks, we ensure robust locator usage
    await expect(page.locator('h2', { hasText: 'Commercial Capabilities' }).or(page.locator('h2', { hasText: 'Commercial Map' }))).toBeVisible();
  });
});
