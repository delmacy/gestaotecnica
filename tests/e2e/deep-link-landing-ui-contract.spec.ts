import { test, expect } from '@playwright/test';
import { allowAuthenticatedArea } from './auth-helper';

test.describe('Deep Link Landing UI Contract E2E', () => {
    test.beforeEach(async ({ page }) => {
        // According to memory constraints:
        // "In Playwright E2E tests, to bypass authentication and access the authenticated area, import and call the allowAuthenticatedArea(page) helper from tests/e2e/auth-helper.ts within the test setup. Note: You must navigate to a page on the domain (e.g., await page.goto('/')) *before* setting the cookies, or Next.js middleware may still redirect to /auth/login."
        // We will visit an arbitrary lightweight page or the root first to set the cookie domain, then apply the cookie.

        // Setting up domain context
        await page.goto('/');
        await allowAuthenticatedArea(page);

        // Navigate to the UI contract test page
        await page.goto('/builder/ui-contracts/deep-link-landing-test');
    });

    test('validates Gate 1: unauthenticated state routes to login', async ({ page }) => {
        // Trigger Unauthenticated scenario
        await page.click('#test-unauthenticated');

        // Wait for the resolution panel to appear
        const panel = page.locator('[data-testid="deep-link-resolution-panel"]');
        await expect(panel).toBeVisible();

        // Assert the expected status and target URL
        await expect(page.locator('[data-testid="resolution-status"]')).toHaveText('unauthenticated');
        const targetUrl = await page.locator('[data-testid="resolution-target-url"]').textContent();
        expect(targetUrl).toMatch(/^\/auth\/login\?returnTo=/);
    });

    test('validates Gate 2: authorized state routes to target', async ({ page }) => {
        // Trigger Authorized scenario
        await page.click('#test-authorized');

        // Wait for the resolution panel to appear
        const panel = page.locator('[data-testid="deep-link-resolution-panel"]');
        await expect(panel).toBeVisible();

        // Assert the expected status, target URL, and context hydration
        await expect(page.locator('[data-testid="resolution-status"]')).toHaveText('authorized');
        await expect(page.locator('[data-testid="resolution-target-url"]')).toHaveText('/builder/capabilities/cap-123');
        await expect(page.locator('[data-testid="resolution-context"]')).toHaveText('Yes');
    });

    test('validates Gate 3: unauthorized state routes to blocked/fallback path', async ({ page }) => {
        // Trigger Unauthorized scenario
        await page.click('#test-unauthorized');

        // Wait for the resolution panel to appear
        const panel = page.locator('[data-testid="deep-link-resolution-panel"]');
        await expect(panel).toBeVisible();

        // Assert the expected status and fallback target URL
        await expect(page.locator('[data-testid="resolution-status"]')).toHaveText('unauthorized');
        await expect(page.locator('[data-testid="resolution-target-url"]')).toHaveText('/builder');
    });

    test('validates Gate 4: missing entity routes to not found path', async ({ page }) => {
        // Trigger Not Found scenario
        await page.click('#test-not-found');

        // Wait for the resolution panel to appear
        const panel = page.locator('[data-testid="deep-link-resolution-panel"]');
        await expect(panel).toBeVisible();

        // Assert the expected status and fallback target URL
        await expect(page.locator('[data-testid="resolution-status"]')).toHaveText('not_found');
        await expect(page.locator('[data-testid="resolution-target-url"]')).toHaveText('/builder/capabilities');
    });
});
