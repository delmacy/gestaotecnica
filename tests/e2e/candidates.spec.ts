import { expect, test } from "@playwright/test";

test.describe("Process Candidates", () => {
  test("expõe busca, filtro e estado recuperável", async ({ page }) => {
    await page.goto("/candidates");

    await expect(page.getByRole("heading", { name: "Process Candidates" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Buscar candidatos" })).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Filtrar candidatos por status" })).toBeVisible();

    const alert = page.getByRole("alert");
    if (await alert.isVisible()) {
      await expect(alert).not.toContainText(/select|process_candidates|workspace_id/i);
      await expect(page.getByRole("button", { name: "Tentar novamente" })).toBeVisible();
      return;
    }

    const candidateButtons = page.getByRole("button", { name: /^Selecionar candidato / });
    if (await candidateButtons.count()) {
      await candidateButtons.first().focus();
      await page.keyboard.press("Enter");
      await expect(candidateButtons.first()).toHaveAttribute("aria-pressed", "true");
    } else {
      await expect(page.getByText("Nenhum candidato encontrado.")).toBeVisible();
    }
  });
});
