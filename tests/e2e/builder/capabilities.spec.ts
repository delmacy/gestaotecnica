import { test, expect } from '@playwright/test';
import { allowAuthenticatedArea } from '../auth-helper';

test.describe('Global Capabilities Entry Experience', () => {
  test('should display synthetic mode indicator and capabilities list', async ({ page }) => {
    await allowAuthenticatedArea(page);

    // Navigate to the capabilities page
    await page.goto('/builder/capabilities');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check for the main heading
    await expect(page.locator('h1', { hasText: 'Capabilities globais' })).toBeVisible();

    // The backend payload returns `state: 'synthetic'`, so the Synthetic Mode banner should be visible
    await expect(page.locator('div', { hasText: 'Synthetic Mode' }).first()).toBeVisible();
    await expect(page.locator('div', { hasText: 'Catalogo base em consolidacao. Esta superficie apresenta capabilities ilustrativas e operacoes de solicitacao nao tem persistencia real no banco de dados.' }).first()).toBeVisible();

    // Check if at least one capability card is rendered
    await expect(page.locator('.grid > div').first()).toBeVisible();

    await page.waitForTimeout(1000);

    await page.locator('.grid > div').first().click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: '/home/jules/verification/screenshots/verification.png' });

    await page.waitForTimeout(1000);
  });
});
