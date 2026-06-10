# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: gateway-receipts.spec.ts >> Agent Gateway Receipts UI >> can navigate to receipts page from AppShell
- Location: tests/e2e/gateway-receipts.spec.ts:25:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/admin
Call log:
  - navigating to "http://localhost:3000/admin", waiting until "load"

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
> 27 |     await page.goto("/admin");
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/admin
  28 |
  29 |     const link = page.locator("a[href='/admin/gateway/receipts']").first();
  30 |     await expect(link).toBeVisible();
  31 |     await link.click();
  32 |
  33 |     await expect(page).toHaveURL(/\/admin\/gateway\/receipts/);
  34 |   });
  35 | });
  36 |
```