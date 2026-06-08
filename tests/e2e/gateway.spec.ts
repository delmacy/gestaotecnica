import { allowAuthenticatedArea } from './auth-helper';
import { test, expect } from '@playwright/test';

test.describe('Agent Gateway Control Plane', () => {
  test('should render the gateway page correctly', async ({ page }) => {
    // Navigate to the gateway page
    await allowAuthenticatedArea(page);
    await page.goto('/admin/gateway');

    // Check if the header is visible
    await expect(page.locator('h1', { hasText: 'Agent Gateway Control Plane' })).toBeVisible();

    // Check if the technical warning is visible
    await expect(page.locator('text=Aviso Técnico')).toBeVisible();

    // Since we're not inserting records in this test, we should see the empty state
    // We just wait for the loading state to disappear and empty state to appear
    await expect(page.locator('text=Nenhuma submissão de agente encontrada.')).toBeVisible({ timeout: 10000 });
  });
});
