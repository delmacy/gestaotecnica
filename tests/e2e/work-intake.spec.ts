import { test, expect } from '@playwright/test';
import { allowAuthenticatedArea } from './auth-helper';

test('work intake form submission redirects to detail view', async ({ page }) => {
  await page.goto('/');
  await allowAuthenticatedArea(page);
  await page.goto('/work-intake');

  await expect(page.locator('h1').last()).toContainText('Work Intake');

  await page.fill('input[name="title"]', 'New request from E2E');
  await page.fill('input[name="category"]', 'E2E Category');
  await page.selectOption('select[name="priority"]', 'high');
  await page.fill('textarea[name="description"]', 'E2E Description');
  await page.fill('input[name="requesterName"]', 'E2E Requester');

  await page.click('button[type="submit"]');

  await page.waitForURL(/\/work-intake\/.+/, { timeout: 10000 });
  await expect(page.locator('h1').last()).toContainText('New request from E2E');
  await expect(page.locator('text=E2E Category').first()).toBeVisible();
});
