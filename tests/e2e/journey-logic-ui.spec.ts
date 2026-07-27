import { test, expect } from '@playwright/test';
import { allowAuthenticatedArea } from './auth-helper';

test.describe('Journey Logic Regression Gate', () => {
  test.beforeEach(async ({ page }) => {
    // Auth bypass via cookie
    await page.goto('/');
    await allowAuthenticatedArea(page);
    await page.goto('/ui-contracts-bypass/journey-test');
  });

  test('should execute START action', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Journey Logic Regression Gate' })).toBeVisible();

    // START
    await page.click('#btn-start');

    // The toast message is commercial/product oriented as per contract
    await expect(page.locator('ol[data-sonner-toaster]')).toContainText('Continuing your setup');

    // Result JSON block
    const result = await page.locator('#journey-result').textContent();
    expect(result).toContain('"status": "real"');
  });

  test('should execute DISCARD action', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Journey Logic Regression Gate' })).toBeVisible();

    // DISCARD
    await page.click('#btn-discard');

    // The toast message is commercial/product oriented as per contract
    await expect(page.locator('ol[data-sonner-toaster]')).toContainText('Setup cancelled');

    // Result JSON block
    const result = await page.locator('#journey-result').textContent();
    expect(result).toContain('"status": "real"');
  });
});
