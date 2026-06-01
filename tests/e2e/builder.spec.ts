import { test, expect } from '@playwright/test';

test.describe('Builder Interactivity', () => {
  test('Ao clicar em um nó do Explorer, o Inspector deve aparecer', async ({ page }) => {
    await page.goto('/builder');

    // Verificar renderização do shell e arvore
    await expect(page.getByText('Acme Holding')).toBeVisible();

    // Clicar em um workspace pra abrir propriedades
    await page.getByText('Produção Brasil').click();

    // Validar se o inspector refletiu a selecao ("Inspector" title ou nome da selection no inspector)
    await expect(page.getByText('Selecione um elemento na árvore ou no canvas para ver suas propriedades.')).toBeHidden();
  });
});
