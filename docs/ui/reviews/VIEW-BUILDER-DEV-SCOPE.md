# View Builder Dev Scope

## 1. Objetivo do desenvolvimento permitido
Implementar o UI "View Builder" como uma aplicação puramente cliente, onde os utilizadores podem explorar e interagir mockadamente com schemas visuais (blueprints). Não deve haver qualquer traço de backend interativo.

## 2. Arquivos candidatos prováveis
- `src/app/(builder)/builder/view-builder/page.tsx`
- `src/components/builder/view-builder/ViewBuilderStudio.tsx`
- `src/components/builder/view-builder/ViewBlueprintList.tsx`
- `src/components/builder/view-builder/ViewTypeSelector.tsx`
- `src/components/builder/view-builder/ViewCanvas.tsx`
- `src/components/builder/view-builder/ViewFieldPalette.tsx`
- `src/components/builder/view-builder/ViewFieldDetailPanel.tsx`
- `src/components/builder/view-builder/ViewPreviewPanel.tsx`
- `src/components/builder/view-builder/ViewFiltersPanel.tsx`
- `src/components/builder/view-builder/ViewSortingPanel.tsx`
- `src/components/builder/view-builder/ViewActionsPanel.tsx`
- `src/components/builder/view-builder/ViewBindingsPanel.tsx`
- `src/components/builder/view-builder/ViewGovernancePanel.tsx`
- `src/components/builder/view-builder/view-builder-data.ts`
- `src/components/builder/view-builder/view-builder-types.ts`

## 3. Componentes candidatos
Serão gerados componentes React funcionais baseados nos existentes (usando Lucide-react e shadcn/ui minimal). A navegação profunda será simulada (painéis).

## 4. Dados mock/static schema permitidos
- Blueprint mockados para preencher as listagens, englobando tabelas base e visões Kanban (sintéticas).
- Arrays de objetos de configuração pre-build.

## 5. Dados proibidos
- Consultas no DB para `Capabilities`.
- APIs REST ou tRPC reais.
- Uso de `Server Actions` de mutate.
- Auth Sessions.

## 6. Regras visuais obrigatórias
- Barra de header evidenciando "DESIGN ONLY".
- Layout responsivo básico com sidebar fixa à esquerda.
- Ícones que denotem que os campos são configuráveis, mas botões de ação que não redirecionam páginas de verdade.

## 7. Regras de interação design-only
- Selecionar um blueprint reflete instantaneamente nos painéis centrais sem requests.
- Clicar "Preview" mostra mock renderizado e não tela isolada real (na mesma página central).

## 8. Critérios de aceite
- Todos os arquivos propostos foram renderizados e não disparam erros 404/500 na rota candidata.
- A aplicação compila estaticamente (sem `use server` em actions de View Builder).

## 9. Testes esperados
- `npm run lint` não acusa violações no folder do módulo.
- `npm run build` cria a página estaticamente com Next.js.
- Padrão unit-test (`npm run test:unit`) continua sendo aprovado sem quebra.

## 10. Gatilhos de parada
- Exigência imposta de migrar a tabela ou ler Drizzle ORM (pare imediatamente).
- Quebra de imports não resolvível do shadcn base.
