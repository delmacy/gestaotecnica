# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: candidates.spec.ts >> Process Candidates >> expõe busca, filtro e estado recuperável
- Location: tests/e2e/candidates.spec.ts:5:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/candidates
Call log:
  - navigating to "http://localhost:3000/candidates", waiting until "load"

```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | import { allowAuthenticatedArea } from "./auth-helper";
  3  |
  4  | test.describe("Process Candidates", () => {
  5  |   test("expõe busca, filtro e estado recuperável", async ({ page }) => {
  6  |     await allowAuthenticatedArea(page);
> 7  |     await page.goto("/candidates");
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/candidates
  8  |
  9  |     await expect(page.getByRole("heading", { name: "Process Candidates" })).toBeVisible();
  10 |     await expect(page.getByRole("textbox", { name: "Buscar candidatos" })).toBeVisible();
  11 |     await expect(page.getByRole("combobox", { name: "Filtrar candidatos por status" })).toBeVisible();
  12 |
  13 |     const alert = page.getByRole("alert");
  14 |     if (await alert.isVisible()) {
  15 |       await expect(alert).not.toContainText(/select|process_candidates|workspace_id/i);
  16 |     }
  17 |
  18 |     const candidateButtons = page.getByRole("button", { name: /^Selecionar candidato / });
  19 |     if (await candidateButtons.count()) {
  20 |       await candidateButtons.first().focus();
  21 |       await page.keyboard.press("Enter");
  22 |       await expect(candidateButtons.first()).toHaveAttribute("aria-pressed", "true");
  23 |     } else {
  24 |       await expect(page.getByText("Nenhum candidato encontrado.")).toBeVisible();
  25 |     }
  26 |   });
  27 | });
  28 |
```