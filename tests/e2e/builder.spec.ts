import { test, expect } from "@playwright/test";

test.describe("Builder Interactivity", () => {
  test("Ao clicar em um nó do Explorer, o Inspector deve aparecer", async ({ page }) => {
    await page.goto("/builder");

    await expect(page.getByRole("banner").getByText("System Assembler", { exact: true })).toBeVisible();
    await expect(page.getByTestId("tree-item-orgs")).toBeVisible();
    await expect(page.getByTestId("tree-item-catalog")).toBeVisible();

    await page.getByTestId("tree-item-orgs").click();

    await expect(page.getByText("Selecione um elemento na árvore ou no canvas para ver suas propriedades.")).toBeHidden();
    await expect(page.getByRole("heading", { name: "Organizações" })).toBeVisible();
  });
});
