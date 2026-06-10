# Tasker Board Dev Scope

Este documento define os limites, escopo e restrições para a implementação de código pela IA (Jules Dev) na task `DEV-TASKER-BOARD-001`.

## 1. Objetivo do desenvolvimento permitido
Implementar a interface de coordenação do Tasker Board (`/builder/tasker`) utilizando os dados mockados, modelos visuais e regras de transição estipulados no contrato, operando de forma 100% client-side (estado de UI em memória), sem depender de serviços externos.

## 2. Arquivos candidatos prováveis
Jules Dev pode precisar atuar na criação ou edição dos arquivos a seguir:
- `src/app/(builder)/builder/tasker/page.tsx`
- `src/components/builder/tasker/TaskerBoard.tsx`
- `src/components/builder/tasker/TaskCard.tsx`
- `src/components/builder/tasker/TaskDetailPanel.tsx`
- `src/components/builder/tasker/TaskFilters.tsx`
- `src/components/builder/tasker/tasker-data.ts`
- `src/components/builder/tasker/tasker-types.ts`

*(Estes são candidatos, e a estrutura exata do framework Next.js dita o local final, mas o namespace `builder/tasker` é mandatório.)*

## 3. Componentes candidatos
O desenvolvimento consistirá em criar ou ajustar os seguintes componentes React:
- Board/Kanban container principal.
- Cards das Tarefas contendo Badges e metadados vitais.
- Painel de filtro (Filtro por Grupo, Filtro por Status).
- Drawer/Painel lateral para exibição dos detalhes de uma task, dependências e evidências.

## 4. Dados mockados permitidos
Os dados permitidos limitam-se estritamente aos arrays mockados baseados nos contratos de UI (`docs/ui/surfaces/tasker/TASKER_BOARD_MOCK_DATA_CONTRACT.md`) para simular o conteúdo que será lido localmente.

## 5. Dados proibidos
- Mocks simulando fluxos operacionais da Gestão Técnica, relatórios do cliente, ou processos produtivos reais.
- Uso de informações que simulem Work Orders do cliente real.
- Uso de bancos de dados locais (SQLite) ou remotos, integrações, APIs live ou sistemas reais de autenticação e RBAC.

## 6. Regras visuais obrigatórias
- Kanban com agrupamentos claros pelos 7 status operacionais.
- Exibição visível e estrita dos badges de Prioridade, Grupo e Bloqueio nos Cards.
- Filtros para Grupo A, B, C, D devem funcionar e manipular a exibição corretamente na tabela/board.
- Grupo D (Bloqueado) e seus cards devem se manter imutáveis e destacadamente bloqueados na UI.

## 7. Regras de transição simuladas
- A alteração do status da task deverá ser simulada por meio do clique de um botão no componente do TaskDetailPanel.
- Evidências devem atuar como bloqueadores visuais ou guards: tentar mover para "done" sem que haja links referenciados na seção de evidências da task não será permitido visualmente.

## 8. Critérios de aceite
- Layout responde corretamente aos cliques (UI interativa).
- Filtros operam ativamente sobre os mock data objects.
- Cards abrem painel detalhado.
- Estado efêmero lida com o arrastar ou mover através dos status (para as tarefas não bloqueadas do grupo A/B).

## 9. Testes esperados
- Teste Unitário validando que os cards contendo um bloqueio ou restrição de Grupo D não permitem mudança de estado em memória.
- Teste E2E (via Playwright) confirmando que o layout renderiza a URL, interage com filtros e exibe detalhe corretamente.

## 10. Gatilhos de parada
Se for identificada uma situação na qual a lógica React demande **Persistência Real**, **Edição do File System (fs/Markdown)**, **Autenticação Real / Permissões (RBAC)**, **Migrações de DB**, ou chamadas ao **Runtime/n8n/API**, o desenvolvimento deve ser parado e a UI substituída por uma simulação estática para aquele bloco específico, não prosseguindo com a implementação back-end não autorizada.
