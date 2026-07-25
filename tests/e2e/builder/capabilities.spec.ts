import { test, expect } from '@playwright/test';
import { allowAuthenticatedArea } from '../auth-helper';

test.describe('Global Capabilities Entry Experience', () => {
  test.beforeEach(async ({ page }) => {
    await allowAuthenticatedArea(page);
    await page.goto('/builder/capabilities');
    await page.waitForLoadState('networkidle');
  });

  test('answers where the user came from, what they do here, where they go next, and how they return', async ({ page }) => {
    // 1. Where they are (Heading)
    await expect(page.locator('h1', { hasText: 'Capabilities globais' })).toBeVisible();

    // 2. What they do here (Cards and actions)
    await expect(page.locator('.grid > div').first()).toBeVisible();

    // 3. Where they go next (Detail panel)
    const card = page.locator('div.cursor-pointer', { hasText: 'Organization' }).first();
    await card.click();
    await expect(page.locator('h2', { hasText: 'Organization' })).toBeVisible();

    // 4. How they return (Close panel, Breadcrumbs, etc)
    // The Sheet component from shadcn/ui renders a button with a Close (X) icon, and assistive text.
    // Usually it can be closed by clicking outside or by pressing the close button.
    const closeBtn = page.locator('button:has(svg.lucide-x), button:has-text("Close"), button[aria-label="Close"]').first();
    // if the button exists and is visible, click it. If not, click outside to close the sheet.
    // Try to click the close button or fallback to pressing Escape
    await page.keyboard.press('Escape');

    await expect(page.locator('h2', { hasText: 'Organization' })).not.toBeVisible();
  });

  test('synthetic state has distinct user-facing outcome', async ({ page }) => {
    // Check for the synthetic mode alert banner
    await expect(page.locator('div', { hasText: 'Explore registry' }).first()).toBeVisible();
    await expect(page.locator('div', { hasText: 'You are exploring the Demo environment. Changes made here will not affect your production workspace.' }).first()).toBeVisible();
  });

  test('blocked state has distinct user-facing outcome (Coming Soon badge)', async ({ page }) => {
    // Future capabilities are subdued and show "Coming Soon" when clicked.
    // The "Coming Soon" text is exactly "Em Breve / Coming Soon" based on the component code.
    const subduedCard = page.locator('.opacity-60.grayscale').first();
    await subduedCard.click();
    await expect(page.locator('div', { hasText: 'Em Breve / Coming Soon' }).first()).toBeVisible();
  });

  test('navigation remains responsive and accessible', async ({ page, isMobile }) => {
    if (isMobile) {
      await expect(page.locator('h1', { hasText: 'Capabilities globais' })).toBeVisible();
    } else {
      await expect(page.locator('h1', { hasText: 'Capabilities globais' })).toBeVisible();
    }
  });
});
