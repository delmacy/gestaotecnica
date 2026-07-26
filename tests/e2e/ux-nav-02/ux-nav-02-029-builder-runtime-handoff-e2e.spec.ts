import { test, expect } from '@playwright/test';
import { allowAuthenticatedArea } from '../auth-helper';

test.describe('Builder to Runtime Handoff - Journey Validation', () => {
  test.beforeEach(async ({ page }) => {
    await allowAuthenticatedArea(page);
    await page.goto('/builder/ui-contracts/handoff-test');
  });

  test('Validates empty app state (No Configs)', async ({ page }) => {
    const card = page.locator('div.group\\/card').filter({ hasText: 'Empty App (No Configs)' }).first();
    const emptyAppButton = card.getByRole('button', { name: /No configs to deploy/i });
    await expect(emptyAppButton).toBeVisible();
    await expect(emptyAppButton).toBeDisabled();

    await expect(card.getByText('Empty', { exact: true })).toBeVisible();
  });

  test('Validates blocked app state (No Rights)', async ({ page }) => {
    const card = page.locator('div.group\\/card').filter({ hasText: 'Restricted App (No Rights)' }).first();
    const blockedButton = card.getByRole('button', { name: /Pro Feature \(Restricted\)/i });
    await expect(blockedButton).toBeVisible();
    await expect(blockedButton).toBeDisabled();

    await expect(card.getByText('Restricted', { exact: true })).toBeVisible();
  });

  test('Validates demo app handoff', async ({ page }) => {
    const card = page.locator('div.group\\/card').filter({ hasText: 'Demo App' }).first();
    const demoButton = card.getByRole('button', { name: /Deploy to Demo Runtime/i });
    await expect(demoButton).toBeVisible();
    await demoButton.click();

    await expect(page.getByText('Handoff Result: DEMO')).toBeVisible();
    await expect(page.locator('.font-medium.text-lg').filter({ hasText: 'Deploy to Demo Runtime' })).toBeVisible();

    // Check that we can navigate
    const viewButton = page.getByRole('button', { name: /View in Runtime/i });
    await expect(viewButton).toBeVisible();
    await viewButton.click();

    await expect(page).toHaveURL(/\/runtime\/demo\/demo-app\?version=1.0.0/);
  });

  test('Validates synthetic app handoff', async ({ page }) => {
    const card = page.locator('div.group\\/card').filter({ hasText: 'Synthetic App' }).first();
    const synthButton = card.getByRole('button').first();
    await expect(synthButton).toBeVisible();
    await synthButton.click();

    await expect(page.locator('pre').filter({ hasText: '"runtimeUrl": "/runtime/synthetic' })).toBeVisible();

    // Check that we can navigate
    const viewButton = page.getByRole('button', { name: /View in Runtime/i });
    await expect(viewButton).toBeVisible();
    await viewButton.click();

    await expect(page).toHaveURL(/\/runtime\/synthetic\/synth-app\?version=1.0.0/);
  });

  test('Validates live app handoff', async ({ page }) => {
    const card = page.locator('div.group\\/card').filter({ hasText: 'Production App' }).first();
    const liveButton = card.getByRole('button').first();
    await expect(liveButton).toBeVisible();
    await liveButton.click();

    await expect(page.locator('pre').filter({ hasText: '"runtimeUrl": "/runtime/app/' })).toBeVisible();

    // Check that we can navigate
    const viewButton = page.getByRole('button', { name: /View in Runtime/i });
    await expect(viewButton).toBeVisible();
    await viewButton.click();

    await expect(page).toHaveURL(/\/runtime\/app\/live-app\?version=1.0.0/);
  });
});
