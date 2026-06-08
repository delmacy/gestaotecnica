import { expect, test } from "@playwright/test";
import { allowAuthenticatedArea } from "./auth-helper";

test.describe("Platform E2E: área autenticada", () => {
  test("redireciona a raiz para login sem sessão", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/auth\/login\?next=%2F$/);
    await expect(page.getByRole("textbox", { name: "E-mail" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
  });

  test("exibe o Command Center quando há sessão", async ({ page }) => {
    await allowAuthenticatedArea(page);
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "System Builder Platform" })).toBeVisible();
    await expect(page.getByText("Área autenticada para administrar a plataforma")).toBeVisible();
    await expect(page.getByText("Dados do workspace selecionado")).toBeVisible();
  });
});
