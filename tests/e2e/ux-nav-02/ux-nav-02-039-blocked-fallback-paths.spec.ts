import { test, expect } from '@playwright/test';
import { allowAuthenticatedArea } from '../auth-helper';

test.describe('UX-NAV-02-039 Blocked Fallback Paths', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await allowAuthenticatedArea(page);
    });

    test('should resolve forbidden_workspace fallback', async ({ page }) => {
        await page.goto('/builder/ui-contracts/blocked-fallback-test');
        await page.getByTestId('reason-select').selectOption('forbidden_workspace');
        await page.getByTestId('env-mode-select').selectOption('real');
        await page.getByTestId('original-path-input').fill('/builder/w-123/capabilities/c-456');
        await page.getByTestId('module-name-input').fill('capabilities');
        await page.getByTestId('workspace-id-input').fill('w-123');

        await page.getByTestId('trigger-btn').click();

        await expect(page.getByTestId('fallback-result')).toBeVisible();
        await expect(page.getByTestId('res-message')).toHaveText('This configuration requires Workspace Admin privileges.');
        await expect(page.getByTestId('res-path')).toHaveText('/builder/w-123');
        await expect(page.getByTestId('res-reason')).toHaveText('forbidden_workspace');
        await expect(page.getByTestId('res-redirect')).toHaveText('No');
    });

    test('should resolve demo mode restriction without redirect', async ({ page }) => {
        await page.goto('/builder/ui-contracts/blocked-fallback-test');
        await page.getByTestId('reason-select').selectOption('forbidden_platform');
        await page.getByTestId('env-mode-select').selectOption('demo');
        await page.getByTestId('original-path-input').fill('/admin/settings');

        await page.getByTestId('trigger-btn').click();

        await expect(page.getByTestId('fallback-result')).toBeVisible();
        await expect(page.getByTestId('res-message')).toHaveText('Action restricted in Demo Simulation. No changes were made.');
        await expect(page.getByTestId('res-path')).toHaveText('/admin/settings');
        await expect(page.getByTestId('res-reason')).toHaveText('demo_restricted');
        await expect(page.getByTestId('res-redirect')).toHaveText('No');
    });

    test('should navigate to fallback path when Execute Navigation is clicked', async ({ page }) => {
        await page.goto('/builder/ui-contracts/blocked-fallback-test');
        await page.getByTestId('reason-select').selectOption('not_found');
        await page.getByTestId('workspace-id-input').fill('w-123');
        await page.getByTestId('module-name-input').fill('capabilities');

        await page.getByTestId('trigger-btn').click();

        await expect(page.getByTestId('fallback-result')).toBeVisible();
        await page.getByTestId('navigate-btn').click();

        await expect(page).toHaveURL(/.*\/builder\/w-123\/capabilities/);
    });
});
