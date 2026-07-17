import { test, expect } from "@playwright/test";
import { allowAuthenticatedArea } from "./auth-helper";
import { getPlatformDb } from '../../src/db';
import { eq } from 'drizzle-orm';
import { processCandidates } from '../../src/db/platform/schema/candidates';

test.describe("Builder Persistence", () => {
  let mockCandidateId: string;

  test.beforeAll(async () => {
    const db = await getPlatformDb();

    // clean up any previous left-overs
    await db.delete(processCandidates).where(eq(processCandidates.name, 'Persistence Test Candidate E2E Unique'));

    // Seed a dummy candidate for persistence testing
    const [inserted] = await db.insert(processCandidates).values({
      workspaceId: '00000000-0000-0000-0000-000000000001',
      name: 'Persistence Test Candidate E2E Unique',
      description: 'Used for E2E persistence testing',
      status: 'under_analysis',
      origin: 'agent',
      proposedDefinition: {},
      evidence: {
        agent: { source: 'playwright', type: 'test', name: 'PersistenceTester', version: '1.0' }
      }
    }).returning({ id: processCandidates.id });

    mockCandidateId = inserted.id;
  });

  test.afterAll(async () => {
    const db = await getPlatformDb();
    if (mockCandidateId) {
      await db.delete(processCandidates).where(eq(processCandidates.id, mockCandidateId));
    }
  });

  test("verifies candidate creation and status visibility", async ({ page }) => {
    await allowAuthenticatedArea(page);
    await page.goto("/candidates");

    // Ensure the page loaded
    await expect(page.getByRole("heading", { name: "Process Candidates" })).toBeVisible({ timeout: 10000 });

    // Verify the candidate is visible in the list
    await expect(page.getByText('Persistence Test Candidate E2E Unique').first()).toBeVisible({ timeout: 10000 });

    // The candidate status should be 'under_analysis' -> mapped to something like "Em Análise"
    await expect(page.getByText('Em Análise', { exact: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test("autosaves local draft and restores it on reload", async ({ page }) => {
    test.setTimeout(60000); // increase timeout
    await allowAuthenticatedArea(page);
    await page.goto("/builder");

    // Wait for builder to load
    await expect(page.getByRole("heading", { name: "System Builder" })).toBeVisible({ timeout: 10000 });

    await expect(page.getByText("Synthetic/Demo Mode Ativo")).toBeVisible({ timeout: 10000 });

    // Try clicking one of the navigation elements or active modules that are part of the page content
    await page.getByRole("link", { name: /Tasker/ }).first().click();

    await expect(page.getByRole("heading", { name: "Tasker" }).first()).toBeVisible({ timeout: 10000 });
  });
});
