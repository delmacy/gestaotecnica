# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: candidate-evidence.spec.ts >> Candidate Evidence UI >> renders structured evidence panels in Candidate Detail
- Location: tests/e2e/candidate-evidence.spec.ts:63:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/candidates
Call log:
  - navigating to "http://localhost:3000/candidates", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { allowAuthenticatedArea } from './auth-helper';
  3   | import { getPlatformDb } from '../../src/db';
  4   | import { eq } from 'drizzle-orm';
  5   | import { processCandidates } from '../../src/db/platform/schema/candidates';
  6   |
  7   | test.describe('Candidate Evidence UI', () => {
  8   |   let mockCandidateId: string;
  9   |
  10  |   test.beforeAll(async () => {
  11  |     const db = await getPlatformDb();
  12  |
  13  |     // Seed a dummy candidate with structured evidence
  14  |     const [inserted] = await db.insert(processCandidates).values({
  15  |       workspaceId: '00000000-0000-0000-0000-000000000001', // Mock workspace ID
  16  |       name: 'Agent Proposed Candidate',
  17  |       description: 'Mocked description from agent',
  18  |       status: 'under_analysis',
  19  |       origin: 'agent',
  20  |       proposedDefinition: {},
  21  |       evidence: {
  22  |         agent: {
  23  |           source: 'paperclip',
  24  |           type: 'process_builder',
  25  |           name: 'PlaywrightAgent',
  26  |           version: '1.0'
  27  |         },
  28  |         proposal: {
  29  |           confidenceScore: 0.95,
  30  |           suggestedStates: [
  31  |             { key: 'review', label: 'Em Revisão', order: 1 }
  32  |           ],
  33  |           suggestedForms: [
  34  |             {
  35  |               key: 'main_form',
  36  |               title: 'Formulário Principal',
  37  |               fields: [
  38  |                 { key: 'reason', label: 'Motivo', type: 'text', required: true }
  39  |               ]
  40  |             }
  41  |           ]
  42  |         },
  43  |         summary: 'Este candidato foi gerado via E2E test.',
  44  |         observedSignals: [
  45  |           { source: 'slack', summary: 'Mensagem discutindo processo' }
  46  |         ],
  47  |         metadata: {
  48  |           tags: ['e2e', 'test']
  49  |         }
  50  |       }
  51  |     }).returning({ id: processCandidates.id });
  52  |
  53  |     mockCandidateId = inserted.id;
  54  |   });
  55  |
  56  |   test.afterAll(async () => {
  57  |     const db = await getPlatformDb();
  58  |     if (mockCandidateId) {
  59  |       await db.delete(processCandidates).where(eq(processCandidates.id, mockCandidateId));
  60  |     }
  61  |   });
  62  |
  63  |   test('renders structured evidence panels in Candidate Detail', async ({ page }) => {
  64  |     await allowAuthenticatedArea(page);
  65  |
  66  |     // Navigate to candidates page
> 67  |     await page.goto('/candidates');
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/candidates
  68  |
  69  |     // Wait for the candidates list to load and click on our mock
  70  |     await page.getByText('Agent Proposed Candidate').first().click();
  71  |
  72  |     // Check Agent Summary
  73  |     await expect(page.getByText('Origem da proposta')).toBeVisible();
  74  |     await expect(page.locator('span.font-medium').filter({ hasText: /^Paperclip$/ })).toBeVisible();
  75  |     await expect(page.locator('span.font-medium').filter({ hasText: /^Agente construtor de processo$/ })).toBeVisible();
  76  |     await expect(page.locator('span.font-medium').filter({ hasText: /^PlaywrightAgent$/ })).toBeVisible();
  77  |     await expect(page.getByText('95%')).toBeVisible();
  78  |
  79  |     // Check Summary
  80  |     await expect(page.getByText('Resumo da Evidência')).toBeVisible();
  81  |     await expect(page.locator('p').filter({ hasText: /^Este candidato foi gerado via E2E test.$/ })).toBeVisible({ timeout: 10000 });
  82  |
  83  |     // Check Suggested States
  84  |     await expect(page.getByText('Estados Sugeridos')).toBeVisible();
  85  |     await expect(page.locator('div.col-span-4.font-medium').filter({ hasText: /^Em Revisão$/ })).toBeVisible();
  86  |
  87  |     // Check Suggested Forms
  88  |     await expect(page.getByText('Formulários Sugeridos')).toBeVisible();
  89  |     await expect(page.locator('span').filter({ hasText: /^Formulário Principal$/ })).toBeVisible();
  90  |
  91  |     // Open accordion to check fields
  92  |     await page.locator('summary').filter({ hasText: 'Formulário Principal' }).click();
  93  |     await expect(page.locator('div.col-span-4.font-medium').filter({ hasText: /^Motivo$/ })).toBeVisible();
  94  |
  95  |     // Check Observed Signals
  96  |     await expect(page.getByText('Sinais Observados')).toBeVisible();
  97  |     await expect(page.locator('p').filter({ hasText: /^Mensagem discutindo processo$/ })).toBeVisible();
  98  |
  99  |     // Check Metadata
  100 |     await expect(page.getByText('Metadados')).toBeVisible();
  101 |     await expect(page.locator('span').filter({ hasText: /^e2e$/ })).toBeVisible();
  102 |
  103 |     // Check Raw Fallback
  104 |     await expect(page.getByText('Evidência Bruta (JSON)')).toBeVisible();
  105 |   });
  106 | });
  107 |
```