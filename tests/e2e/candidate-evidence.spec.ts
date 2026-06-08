import { test, expect } from '@playwright/test';
import { allowAuthenticatedArea } from './auth-helper';
import { getPlatformDb } from '../../src/db';
import { eq } from 'drizzle-orm';
import { processCandidates } from '../../src/db/platform/schema/candidates';

test.describe('Candidate Evidence UI', () => {
  let mockCandidateId: string;

  test.beforeAll(async () => {
    const db = await getPlatformDb();

    // Seed a dummy candidate with structured evidence
    const [inserted] = await db.insert(processCandidates).values({
      workspaceId: '00000000-0000-0000-0000-000000000001', // Mock workspace ID
      name: 'Agent Proposed Candidate',
      description: 'Mocked description from agent',
      status: 'under_analysis',
      origin: 'agent',
      proposedDefinition: {},
      evidence: {
        agent: {
          source: 'paperclip',
          type: 'process_builder',
          name: 'PlaywrightAgent',
          version: '1.0'
        },
        proposal: {
          confidenceScore: 0.95,
          suggestedStates: [
            { key: 'review', label: 'Em Revisão', order: 1 }
          ],
          suggestedForms: [
            {
              key: 'main_form',
              title: 'Formulário Principal',
              fields: [
                { key: 'reason', label: 'Motivo', type: 'text', required: true }
              ]
            }
          ]
        },
        summary: 'Este candidato foi gerado via E2E test.',
        observedSignals: [
          { source: 'slack', summary: 'Mensagem discutindo processo' }
        ],
        metadata: {
          tags: ['e2e', 'test']
        }
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

  test('renders structured evidence panels in Candidate Detail', async ({ page }) => {
    await allowAuthenticatedArea(page);

    // Navigate to candidates page
    await page.goto('/candidates');

    // Wait for the candidates list to load and click on our mock
    await page.getByText('Agent Proposed Candidate').first().click();

    // Check Agent Summary
    await expect(page.getByText('Origem da proposta')).toBeVisible();
    await expect(page.locator('span.font-medium').filter({ hasText: /^Paperclip$/ })).toBeVisible();
    await expect(page.locator('span.font-medium').filter({ hasText: /^Agente construtor de processo$/ })).toBeVisible();
    await expect(page.locator('span.font-medium').filter({ hasText: /^PlaywrightAgent$/ })).toBeVisible();
    await expect(page.getByText('95%')).toBeVisible();

    // Check Summary
    await expect(page.getByText('Resumo da Evidência')).toBeVisible();
    await expect(page.locator('p').filter({ hasText: /^Este candidato foi gerado via E2E test.$/ })).toBeVisible({ timeout: 10000 });

    // Check Suggested States
    await expect(page.getByText('Estados Sugeridos')).toBeVisible();
    await expect(page.locator('div.col-span-4.font-medium').filter({ hasText: /^Em Revisão$/ })).toBeVisible();

    // Check Suggested Forms
    await expect(page.getByText('Formulários Sugeridos')).toBeVisible();
    await expect(page.locator('span').filter({ hasText: /^Formulário Principal$/ })).toBeVisible();

    // Open accordion to check fields
    await page.locator('summary').filter({ hasText: 'Formulário Principal' }).click();
    await expect(page.locator('div.col-span-4.font-medium').filter({ hasText: /^Motivo$/ })).toBeVisible();

    // Check Observed Signals
    await expect(page.getByText('Sinais Observados')).toBeVisible();
    await expect(page.locator('p').filter({ hasText: /^Mensagem discutindo processo$/ })).toBeVisible();

    // Check Metadata
    await expect(page.getByText('Metadados')).toBeVisible();
    await expect(page.locator('span').filter({ hasText: /^e2e$/ })).toBeVisible();

    // Check Raw Fallback
    await expect(page.getByText('Evidência Bruta (JSON)')).toBeVisible();
  });
});
