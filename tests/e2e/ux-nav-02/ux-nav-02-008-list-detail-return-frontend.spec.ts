import { test, expect } from '@playwright/test';
import { allowAuthenticatedArea } from '../auth-helper';

test.describe('UX-NAV-02-008 List/Detail/Return Frontend Experience', () => {
  test.beforeEach(async ({ page }) => {
    await allowAuthenticatedArea(page);
  });

  test('returns to the list view from the contextual return path', async ({ page }) => {
    await page.goto('/builder/tasker/new?origin=%2Fbuilder%2Ftasker');

    await expect(page.locator('h1')).toContainText('Log New Task');

    const returnLink = page.locator('a', { hasText: 'Return' }).first();
    await expect(returnLink).toBeVisible();
    await expect(returnLink).toHaveAttribute('href', '/builder/tasker');

    await returnLink.click();
    await expect(page).toHaveURL(/.*\/builder\/tasker$/);
  });

  test('cross scope return access denied message', async ({ page }) => {
    await page.goto('/builder/tasker/new?origin=%2Fadmin');

    await expect(page.locator('h3', { hasText: 'Access Denied' })).toBeVisible();

    const returnLink = page.locator('a', { hasText: 'Return' }).first();
    await expect(returnLink).toBeVisible();
    await expect(returnLink).toHaveAttribute('href', '/builder/dashboard');

    await returnLink.click();
    await expect(page).toHaveURL(/.*\/builder\/dashboard$/);
  });
});
