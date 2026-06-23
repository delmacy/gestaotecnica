# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-login-profiles.spec.ts >> Auth Login Profiles >> credenciais invalidas mostram erro amigavel
- Location: tests/e2e/auth-login-profiles.spec.ts:4:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/auth/login
Call log:
  - navigating to "http://localhost:3000/auth/login", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  |
  3  | test.describe("Auth Login Profiles", () => {
  4  |   test("credenciais invalidas mostram erro amigavel", async ({ page }) => {
> 5  |     await page.goto("/auth/login");
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/auth/login
  6  |     await page.fill('input[name="email"]', "fake@email.com");
  7  |     await page.fill('input[name="password"]', "wrongpass");
  8  |
  9  |     await page.click('button[type="submit"]');
  10 |
  11 |     // the page should show an error message
  12 |     await expect(page.locator("text=Credenciais inválidas.")).toBeVisible();
  13 |     expect(page.url()).toContain("/auth/login");
  14 |   });
  15 | });
  16 |
```