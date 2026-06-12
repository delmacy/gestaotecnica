# UI Contracts Viewer - MVP Plan

## 1. Objetivo do MVP
Fornecer uma superfície "read-only" integrada ao Builder Shell para indexar e visualizar os contratos de UI (UiSurfaceContract) definidos e a definir. O objetivo é visualizar status, rotas, grupos (A, B, C, D) e limites sem depender de banco de dados ou parser real de Markdown.

## 2. O que o módulo faz
- Lista os contratos de UI com dados mockados em um Static Index.
- Permite filtrar e buscar contratos (por status, grupo, nome ou surface_id).
- Exibe o painel de detalhes do contrato, estruturando campos como persona, scopo, permissões, e evidências esperadas.
- Mostra a matriz de implementação (visualização gráfica de progresso mockada).
- Relaciona o contrato a "reviews" ou "tasks" (visualmente simuladas).
- Deixa explícito o modo read-only e dados sintéticos.

## 3. O que o módulo não faz
- Não edita contratos reais de Markdown (nenhum POST/PUT ou server action).
- Não persiste dados no banco de dados.
- Não lê diretamente o filesystem real (usa dados estáticos injetados na compilação/frontend).
- Não substitui o Registry View ou o Docs Viewer genérico.
- Não gera código ou rotas em runtime.
- Não aciona API real.

## 4. Personas
- Builder Platform Architect
- Builder Dev
- UX Architect

## 5. Entidades mínimas (Conceituais / Typescript Interfaces)
- UiSurfaceContract
- UiContractField
- UiContractStatus
- UiContractGroup
- UiContractRoute
- UiContractEvidence
- UiContractRisk
- UiContractReviewLink
- UiContractImplementationState
- UiContractDependency

## 6. Telas/seções mínimas
- Contract List (Sidebar list/grid view)
- Contract Detail (Painel principal)
- Contract Fields (Apresentação dos dados)
- Route & Status (Headers/Badges no painel)
- Risks (Sessão dentro dos detalhes)
- Inputs/Outputs (Sessão dentro dos detalhes)
- Commands (Sessão dentro dos detalhes)
- Evidence & Tests (Sessão dentro dos detalhes)
- Related Reviews
- Group Summary (Visão por blocos A, B, C, D)
- Implementation Matrix

## 7. Fluxo de uso
1. Usuário acessa `/builder/ui-contracts`.
2. Um aviso global de "Modo Mock / Static Index" é exibido.
3. A lista de contratos é carregada.
4. O usuário pesquisa por "Tasker Board" ou clica na lista.
5. Os campos detalhados do "Tasker Board" (status "ready", grupo A) são exibidos.
6. O usuário alterna a aba para verificar a matriz de implementação.

## 8. Dados estáticos permitidos
Apenas um arquivo local contendo um array de objetos TypeScript representando os contratos e simulando os dados presentes nos Markdowns reais (ex: `ui-contracts-data.ts`).

## 9. Dados reais futuros
A superfície poderá ser integrada a um leitor de GitHub API ou a um parser de Markdown local com build scripts que injetem dados em um banco de dados de metadados, mas não no escopo deste MVP.

## 10. Regras de contrato
Todo contrato exibido deve ter no mínimo:
- id, surface_id, surface_name, route_candidate, implementation_status, group.

## 11. Regras de status
Contratos podem estar em `documented`, `ready_for_readiness`, `ready_for_dev`, `implemented`, `reviewed`, `approved`, `future`, `blocked`.

## 12. Regras de comparação
A matriz de implementação exibe blocos (Grupo A vs Grupo B vs Grupo D) para mostrar que contratos D continuam bloqueados enquanto B e C são futuros.

## 13. Gaps conhecidos
- A fonte de dados é estática e pode desatualizar em relação aos Markdowns reais, mas serve ao propósito arquitetural.
- Nomes/Id de reviews e dependências são strings simples, não hiperlinks dinâmicos neste momento.

## 14. Critérios de aceite
- Rota `/builder/ui-contracts` renderiza sem quebrar.
- Modo estático/read-only evidenciado.
- Nenhum acesso a banco configurado (sem uso de Drizzle neste módulo).
- Testes unitários do framework Nextjs aprovam o carregamento da tela.

## 15. Próximas tasks
- Revisão Readiness do módulo (DEV-READINESS-UI-CONTRACTS-VIEWER-001).
- Implementação dev (DEV-UI-CONTRACTS-VIEWER-001).
