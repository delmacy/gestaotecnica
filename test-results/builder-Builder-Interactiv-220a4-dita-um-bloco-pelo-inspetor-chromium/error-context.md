# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: builder.spec.ts >> Builder Interactivity >> adiciona e edita um bloco pelo inspetor
- Location: tests/e2e/builder.spec.ts:5:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/builder
Call log:
  - navigating to "http://localhost:3000/builder", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { allowAuthenticatedArea } from "./auth-helper";
  3  |
  4  | test.describe("Builder Interactivity", () => {
  5  |   test("adiciona e edita um bloco pelo inspetor", async ({ page }) => {
  6  |     await allowAuthenticatedArea(page);
> 7  |     await page.goto("/builder");
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/builder
  8  |
  9  |     await expect(page.getByRole("heading", { name: "System Builder" })).toBeVisible();
  10 |     await expect(page.getByRole("heading", { name: "Biblioteca de Blocos" })).toBeVisible();
  11 |     await expect(page.getByRole("heading", { name: "Inspetor de Propriedades" })).toBeVisible();
  12 |     await expect(page.getByText("Selecione um bloco para editar suas propriedades.")).toBeVisible();
  13 |
  14 |     const nodeCount = page.getByText(/^Nós: \d+$/);
  15 |     const initialCount = Number((await nodeCount.textContent())?.replace(/\D/g, ""));
  16 |
  17 |     await page.getByRole("button", { name: /Tarefa humana/ }).click();
  18 |
  19 |     await expect(nodeCount).toHaveText(`Nós: ${initialCount + 1}`);
  20 |     await expect(page.getByText("Selecione um bloco para editar suas propriedades.")).toBeHidden();
  21 |
  22 |     const labelInput = page.getByLabel("Rótulo (Label)");
  23 |     await expect(labelInput).toHaveValue("Tarefa humana");
  24 |     await labelInput.fill("Revisar solicitação");
  25 |     await expect(labelInput).toHaveValue("Revisar solicitação");
  26 |   });
  27 | });
  28 |
```