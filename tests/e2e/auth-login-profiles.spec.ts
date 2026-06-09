import { test, expect } from "@playwright/test";

test.describe("Auth Login Profiles", () => {
  test("credenciais invalidas mostram erro amigavel", async ({ page }) => {
    await page.goto("/auth/login");
    await page.fill('input[name="email"]', "fake@email.com");
    await page.fill('input[name="password"]', "wrongpass");

    await page.click('button[type="submit"]');

    // the page should show an error message
    await expect(page.locator("text=Credenciais inválidas.")).toBeVisible();
    expect(page.url()).toContain("/auth/login");
  });
});
