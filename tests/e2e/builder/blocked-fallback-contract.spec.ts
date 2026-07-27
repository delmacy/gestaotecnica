import { test, expect } from '@playwright/test';
import { allowAuthenticatedArea } from '../auth-helper';

test.describe('Blocked, Error, and Fallback Paths - Contract Journey Validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/builder/ui-contracts/blocked-fallback-test");
        await allowAuthenticatedArea(page);
    });

    test('validates blocked workspace access resolution', async ({ page }) => {
        await page.goto('/builder/ui-contracts/blocked-fallback-test');

        await page.locator('[data-testid="reason-select"]').selectOption('forbidden_workspace');
        await page.locator('[data-testid="workspace-id-input"]').fill('wksp-123');
        await page.locator('[data-testid="trigger-btn"]').click();

        await expect(page.locator('[data-testid="res-message"]')).toContainText('This configuration requires Workspace Admin privileges.');
        await expect(page.locator('[data-testid="res-path"]')).toContainText('/builder/wksp-123');
        await expect(page.locator('[data-testid="res-redirect"]')).toContainText('No');

        // Execute navigation
        await page.locator('[data-testid="navigate-btn"]').click();
        await page.waitForURL('**/builder/wksp-123');
        expect(page.url()).toContain('/builder/wksp-123');
    });

    test('validates missing entity (not found) resolution', async ({ page }) => {
        await page.goto('/builder/ui-contracts/blocked-fallback-test');

        await page.locator('[data-testid="reason-select"]').selectOption('not_found');
        await page.locator('[data-testid="workspace-id-input"]').fill('wksp-123');
        await page.locator('[data-testid="module-name-input"]').fill('portfolios');
        await page.locator('[data-testid="trigger-btn"]').click();

        await expect(page.locator('[data-testid="res-message"]')).toContainText('Configuration Unavailable.');
        await expect(page.locator('[data-testid="res-path"]')).toContainText('/builder/wksp-123/portfolios');

        // Execute navigation
        await page.locator('[data-testid="navigate-btn"]').click();
        await page.waitForURL('**/builder/wksp-123/portfolios');
        expect(page.url()).toContain('/builder/wksp-123/portfolios');
    });

    test('validates demo environment restriction resolution', async ({ page }) => {
        await page.goto('/builder/ui-contracts/blocked-fallback-test');

        await page.locator('[data-testid="reason-select"]').selectOption('forbidden_workspace');
        await page.locator('[data-testid="env-mode-select"]').selectOption('demo');
        await page.locator('[data-testid="original-path-input"]').fill('/builder/wksp-123/capabilities/c-456');

        await page.locator('[data-testid="trigger-btn"]').click();

        await expect(page.locator('[data-testid="res-message"]')).toContainText('Action restricted in Demo Simulation. No changes were made.');
        await expect(page.locator('[data-testid="res-path"]')).toContainText('/builder/wksp-123/capabilities/c-456');

        // Execute navigation
        await page.locator('[data-testid="navigate-btn"]').click();
        await page.waitForURL('**/builder/wksp-123/capabilities/c-456');
        expect(page.url()).toContain('/builder/wksp-123/capabilities/c-456');
    });

    test('validates unauthorized user resolution', async ({ page }) => {
        await page.goto('/builder/ui-contracts/blocked-fallback-test');

        await page.locator('[data-testid="reason-select"]').selectOption('unauthorized');
        await page.locator('[data-testid="trigger-btn"]').click();

        await expect(page.locator('[data-testid="res-message"]')).toContainText('Please log in to continue.');
        await expect(page.locator('[data-testid="res-path"]')).toContainText('/auth/login');
        await expect(page.locator('[data-testid="res-redirect"]')).toContainText('Yes');

        // Execute navigation
        await page.locator('[data-testid="navigate-btn"]').click();
        await page.waitForURL('**/auth/login');
        expect(page.url()).toContain('/auth/login');
    });
});
