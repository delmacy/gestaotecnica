import { test, expect } from "@playwright/test";

test.describe("Builder Interactivity", () => {
  test("adiciona e edita um bloco pelo inspetor", async ({ page }) => {
    await page.goto("/builder");

    await expect(page.getByRole("heading", { name: "System Builder" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Biblioteca de Blocos" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Inspetor de Propriedades" })).toBeVisible();
    await expect(page.getByText("Selecione um bloco para editar suas propriedades.")).toBeVisible();

    const nodeCount = page.getByText(/^Nós: \d+$/);
    const initialCount = Number((await nodeCount.textContent())?.replace(/\D/g, ""));

    await page.getByRole("button", { name: /Tarefa humana/ }).click();

    await expect(nodeCount).toHaveText(`Nós: ${initialCount + 1}`);
    await expect(page.getByText("Selecione um bloco para editar suas propriedades.")).toBeHidden();

    const labelInput = page.getByLabel("Rótulo (Label)");
    await expect(labelInput).toHaveValue("Tarefa humana");
    await labelInput.fill("Revisar solicitação");
    await expect(labelInput).toHaveValue("Revisar solicitação");
  });
});
