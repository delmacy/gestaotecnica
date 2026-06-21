# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: platform.spec.ts >> Platform E2E: área autenticada >> redireciona a raiz para login sem sessão
- Location: tests/e2e/platform.spec.ts:5:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | import { allowAuthenticatedArea } from "./auth-helper";
  3  |
  4  | test.describe("Platform E2E: área autenticada", () => {
  5  |   test("redireciona a raiz para login sem sessão", async ({ page }) => {
> 6  |     await page.goto("/");
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  7  |
  8  |     await expect(page).toHaveURL(/\/auth\/login\?next=%2F$/);
  9  |     await expect(page.getByRole("textbox", { name: "E-mail" })).toBeVisible();
  10 |     await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
  11 |   });
  12 |
  13 |   test("exibe o Command Center quando há sessão", async ({ page }) => {
  14 |     await allowAuthenticatedArea(page);
  15 |     await page.goto("/");
  16 |
  17 |     await expect(page.getByRole("heading", { name: "System Builder Platform" })).toBeVisible();
  18 |     await expect(page.getByText("Área autenticada para administrar a plataforma")).toBeVisible();
  19 |     await expect(page.getByText("Dados do workspace selecionado")).toBeVisible();
  20 |   });
  21 | });
  22 |
```