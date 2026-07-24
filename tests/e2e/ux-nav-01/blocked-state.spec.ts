import { test, expect } from "@playwright/test";

test("Blocked state renders commercial language correctly", async ({ page, context }) => {
  await context.addCookies([
    {
      name: "gestaotecnica_session",
      value: "e2e-authenticated-shell",
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
  await page.goto("/blocked?role=Enterprise", { waitUntil: "networkidle", timeout: 20000 });
  await expect(page.getByText("Plano Superior Necessário", { exact: false })).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("O acesso a esta área de gestão avançada da plataforma não está incluído no seu plano atual", { exact: false })).toBeVisible();
  await expect(page.getByText("licenciamento", { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: "Retornar ao Command Center" })).toBeVisible();
});
