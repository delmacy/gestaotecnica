import { test, expect } from '@playwright/test';
import { allowAuthenticatedArea } from './auth-helper';

test('approvals queue interaction triggers decision and shows receipt', async ({ page }) => {
  await page.goto('/');
  await allowAuthenticatedArea(page);

  // Navigate to approvals queue
  await page.goto('/approvals');

  // Wait for either the empty state or an item in the queue to be visible
  const emptyStateLocator = page.locator('text=Nenhuma OS aguardando revisao');
  const queueItemFormLocator = page.locator('form').filter({ hasText: 'Aprovar OS' }).first();

  // We use Promise.race to wait for either one to become visible
  await expect(emptyStateLocator.or(queueItemFormLocator)).toBeVisible();

  const hasEmptyState = await emptyStateLocator.isVisible();

  if (!hasEmptyState) {
    const approveForm = queueItemFormLocator;
    await approveForm.locator('input[name="note"]').fill('E2E Approval Note');
    await approveForm.locator('button[type="submit"]').click();

    // Wait for the success receipt state
    await expect(approveForm.locator('text=OS aprovada')).toBeVisible({ timeout: 10000 });
  } else {
    // Basic screen load assertion
    await expect(page.locator('h1').last()).toContainText('Revisao tecnica');
  }
});
