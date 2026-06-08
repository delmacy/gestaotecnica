# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: gateway-receipts.spec.ts >> Agent Gateway Receipts UI >> can navigate to receipts page from AppShell
- Location: tests/e2e/gateway-receipts.spec.ts:25:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('a[href=\'/admin/gateway/receipts\']').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('a[href=\'/admin/gateway/receipts\']').first()

```

```yaml
- navigation:
  - button "previous" [disabled]:
    - img "previous"
  - text: 1/1
  - button "next" [disabled]:
    - img "next"
- img
- link "Next.js 16.2.6 (stale) Turbopack":
  - /url: https://nextjs.org/docs/messages/version-staleness
  - img
  - text: Next.js 16.2.6 (stale) Turbopack
- img
- dialog "Build Error":
  - text: Build Error
  - button "Copy Error Info":
    - img
  - link "Go to related documentation":
    - /url: https://nextjs.org/docs/messages/module-not-found
    - img
  - button "Attach Node.js inspector":
    - img
  - text: "Module not found: Can't resolve '@/components/ui/sheet'"
  - img
  - text: ./src/components/platform/gateway/GatewayReceiptDetail.tsx (1:1)
  - button "Open in editor":
    - img
  - text: "Module not found: Can't resolve '@/components/ui/sheet' > 1 | import { | ^^^^^^^ > 2 | Sheet, | ^^^^^^^^ > 3 | SheetContent, | ^^^^^^^^^^^^^^^ > 4 | SheetDescription, | ^^^^^^^^^^^^^^^^^^^ > 5 | SheetHeader, | ^^^^^^^^^^^^^^ > 6 | SheetTitle, | ^^^^^^^^^^^^^ > 7 | } from \"@/components/ui/sheet\"; | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 8 | import type { AgentGatewaySubmissionRecord } from \"@/features/platform/gateway/agent-gatew... 9 | import { GatewayReceiptStatusBadge } from \"./GatewayReceiptStatusBadge\"; 10 | import { GatewayReceiptPayloadViewer } from \"./GatewayReceiptPayloadViewer\"; Import map: aliased to relative './src/components/ui/sheet' inside of [project]/ Import traces: Client Component Browser: ./src/components/platform/gateway/GatewayReceiptDetail.tsx [Client Component Browser] ./src/components/platform/gateway/GatewayReceiptsTable.tsx [Client Component Browser] ./src/components/platform/gateway/GatewayReceiptsTable.tsx [Server Component] ./src/app/admin/gateway/receipts/page.tsx [Server Component] Client Component SSR: ./src/components/platform/gateway/GatewayReceiptDetail.tsx [Client Component SSR] ./src/components/platform/gateway/GatewayReceiptsTable.tsx [Client Component SSR] ./src/components/platform/gateway/GatewayReceiptsTable.tsx [Server Component] ./src/app/admin/gateway/receipts/page.tsx [Server Component]"
  - link "https://nextjs.org/docs/messages/module-not-found":
    - /url: https://nextjs.org/docs/messages/module-not-found
- button "Open Next.js Dev Tools":
  - img
- button "Open issues overlay": 1 Issue
- alert
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { allowAuthenticatedArea } from "./auth-helper";
  3  |
  4  | test.describe("Agent Gateway Receipts UI", () => {
  5  |   test("renders the receipts page and empty state", async ({ page }) => {
  6  |     // Navigate and allow auth area bypass (assuming mock auth or bypassed inside test env)
  7  |     await allowAuthenticatedArea(page);
  8  |     await page.goto("/admin/gateway/receipts");
  9  |
  10 |     // Expect the title to be present
  11 |     await expect(page.locator("h1", { hasText: "Agent Gateway Receipts" })).toBeVisible();
  12 |
  13 |     // Expect empty state to be present or a table if seeded
  14 |     const emptyState = page.locator("text=Não há receipts do Agent Gateway ainda.");
  15 |     const table = page.locator("table");
  16 |
  17 |     // We expect either an empty state or a table (since seed might run)
  18 |     await expect(emptyState.or(table)).toBeVisible();
  19 |
  20 |     // Check for the presence of the filters
  21 |     await expect(page.locator("input[placeholder='Buscar ID, Correlation ou Idempotency...']")).toBeVisible();
  22 |     await expect(page.locator("button:has-text('Buscar')")).toBeVisible();
  23 |   });
  24 |
  25 |   test("can navigate to receipts page from AppShell", async ({ page }) => {
  26 |     await allowAuthenticatedArea(page);
  27 |     await page.goto("/admin");
  28 |
  29 |     const link = page.locator("a[href='/admin/gateway/receipts']").first();
> 30 |     await expect(link).toBeVisible();
     |                        ^ Error: expect(locator).toBeVisible() failed
  31 |     await link.click();
  32 |
  33 |     await expect(page).toHaveURL(/\/admin\/gateway\/receipts/);
  34 |   });
  35 | });
  36 |
```