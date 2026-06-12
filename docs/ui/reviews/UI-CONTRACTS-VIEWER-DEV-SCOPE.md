# UI Contracts Viewer - Dev Scope

Este documento estabelece o escopo exato do desenvolvimento para a feature `UI Contracts Viewer` a ser implementada na branch de desenvolvimento.

## 1. Objetivo do desenvolvimento permitido
Implementar o módulo React para visualização "read-only" do Static Index dos contratos de UI da plataforma, garantindo isolamento total do banco de dados, API, ou sistema de arquivos em runtime.

## 2. Arquivos candidatos prováveis
- `src/app/(builder)/builder/ui-contracts/page.tsx`
- `src/components/builder/ui-contracts/UiContractsViewer.tsx`
- `src/components/builder/ui-contracts/UiContractList.tsx`
- `src/components/builder/ui-contracts/UiContractDetailPanel.tsx`
- `src/components/builder/ui-contracts/UiContractFilters.tsx`
- `src/components/builder/ui-contracts/UiContractImplementationMatrix.tsx`
- `src/components/builder/ui-contracts/ui-contracts-data.ts`
- `src/components/builder/ui-contracts/ui-contracts-types.ts`

## 3. Componentes candidatos
- **Viewer Component:** Container que gerencia o estado (contrato ativo, termo de busca, filtros).
- **Sidebar/List:** Apresenta lista clicável.
- **Main View/Tabs:** Exibe os campos de detalhe ou a matriz.
- **Badges/Pills:** Para status e grupos.
- **Alert Banner:** Aviso fixo de limitação (mock).

## 4. Dados mock/static index permitidos
Apenas dados "hardcoded" exportados diretamente do arquivo `ui-contracts-data.ts`. Deve conter um subconjunto razoável dos contratos (ex: Tasker, Builder Shell, Docs Viewer, UI Contracts Viewer).

## 5. Dados proibidos
- `fs.readFileSync` no backend.
- Chamadas a `fetch` dentro ou fora de Server Actions.
- Utilização de `db` ou `schema` do diretório Drizzle.

## 6. Regras visuais obrigatórias
- Usar os ícones Lucide consistentes com o resto do Builder Shell (envoltos em `<div title="...">` se necessário).
- Avisos de "Mock / Static Index" visíveis.
- Layout contido pelo wrapper principal do `BuilderShell`.

## 7. Regras de interação read-only
- Uso de `useState` para seleção do contrato ativo, abas ativas, e string de busca.
- Nenhuma função ou botão de salvar/submeter deve ser acoplada ou desenhada na interface.

## 8. Critérios de aceite
- O frontend renderiza em `/builder/ui-contracts` sem falhas.
- Testes de build (`npm run build`) passam.
- A navegação entre abas ou itens da lista acontece localmente no cliente sem refresh.

## 9. Testes esperados
- `npm run lint` passa limpo nos arquivos tocados.
- Testes unitários do framework continuam passando (se existirem localmente).

## 10. Gatilhos de parada
Pare imediatamente e retorne status de "blocked" ou falha na task caso:
- Descubra que a lista lateral não consegue ser construída sem Tailwind / pacotes extras.
- Identifique necessidade de modificar as configurações de `next.config.js`.
- Esbarre em "prop drilling" excessivo e tenha ímpeto de instalar Zustand/Redux. (Resolva com composição React).
